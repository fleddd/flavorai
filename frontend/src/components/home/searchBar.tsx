import { useState, useCallback, useMemo } from 'react';
import {
    Stack,
    Autocomplete,
    TextField,
    Chip,
    Button,
    Collapse,
    Slider,
    Pagination,
    Typography,
} from '@mui/material';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router';
import type { Recipe, SearchParams } from '../../types/recipe.types';
import { useSearchRecipesQuery } from '../../hooks/useSearchRecipesQuery';
import { PAGES } from '../../config/pages-url.config';
import { CuisineEnum } from '../../constants/enums';

const CUISINES = Object.values(CuisineEnum)

export default function AdvancedSearch() {
    const [searchParams, setSearchParams] = useState<SearchParams>({
        query: '',
        cuisines: [],
        timeMax: 120,
        page: 1,
        limit: 10,
    });

    const [expanded, setExpanded] = useState(false);
    const [debouncedParams] = useDebounce(searchParams, 300);
    const navigate = useNavigate();

    const { data: recipes, isLoading, isError } = useSearchRecipesQuery(debouncedParams);


    const toggleCuisine = useCallback((cuisine: string) => {
        setSearchParams(prev => ({
            ...prev,
            cuisines: prev.cuisines.includes(cuisine)
                ? prev.cuisines.filter(c => c !== cuisine)
                : [...prev.cuisines, cuisine],
            page: 1,
        }));
    }, []);

    const handleTimeChange = useCallback((_e: Event, value: number | number[]) => {
        setSearchParams(prev => ({
            ...prev,
            timeMax: Array.isArray(value) ? value[0] : value,
            page: 1,
        }));
    }, []);

    const handleInputChange = useCallback((_e: React.SyntheticEvent, value: string) => {
        setSearchParams(prev => ({
            ...prev,
            query: value,
            page: 1,
        }));
    }, []);

    const handlePageChange = useCallback((_e: React.ChangeEvent<unknown>, page: number) => {
        setSearchParams(prev => ({ ...prev, page }));
    }, []);

    const handleRecipeSelect = useCallback(
        (_event: React.SyntheticEvent, value: Recipe | string | null) => {
            if (value && typeof value !== 'string' && 'id' in value) {
                navigate(PAGES.RECIPE_DETAILS(value.id));
            }
        },
        [navigate]
    );

    const recipeOptions = useMemo(() => recipes?.data ?? [], [recipes]);

    const cuisineChips = useMemo(
        () =>
            CUISINES.map((cuisine: string) => (
                <Chip
                    key={cuisine}
                    label={cuisine}
                    onClick={() => toggleCuisine(cuisine)}
                    color={searchParams.cuisines.includes(cuisine) ? 'primary' : 'default'}
                    variant="outlined"
                    clickable
                />
            )),
        [searchParams.cuisines, toggleCuisine]
    );


    return (
        <Stack spacing={1} sx={{ width: '100%', maxWidth: 800 }} className="relative">
            <Autocomplete
                options={recipeOptions}
                getOptionLabel={(option: string | Recipe) => (typeof option === 'string' ? option : option.title)}
                onInputChange={handleInputChange}
                onChange={handleRecipeSelect}
                loading={isLoading}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Search recipes..."
                        variant="outlined"
                        error={isError}
                        helperText={isError ? 'Error loading recipes' : undefined}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    <Button size="small" onClick={() => setExpanded(exp => !exp)}>
                                        {expanded ? 'Hide Filters' : 'Advanced'}
                                    </Button>
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                renderOption={(props, option: Recipe) => (
                    <li {...props} key={option.id}>
                        <div>
                            <strong>{option.title}</strong>
                            <div className="text-sm text-gray-500">
                                {option.cuisineType} • {option.timeToCook} mins
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {option.ingredients.slice(0, 3).map(ing => (
                                    <Chip key={ing.id} label={ing.ingredient.name} size="small" />
                                ))}
                            </div>
                        </div>
                    </li>
                )}
            />

            <Collapse in={expanded} timeout={0}  >
                <Stack
                    zIndex={100}
                    spacing={2}
                    sx={{
                        p: 2,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        position: 'absolute',
                        width: '100%',
                        maxWidth: 800,
                        boxShadow: 3,
                    }}
                >
                    <div>
                        <Typography variant="subtitle2">Cuisine</Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                            {cuisineChips}
                        </Stack>
                    </div>

                    <div>
                        <Typography variant="subtitle2">Max Cooking Time: {searchParams.timeMax} mins</Typography>
                        <Slider
                            value={searchParams.timeMax}
                            onChange={handleTimeChange}
                            min={10}
                            max={120}
                            step={5}
                            valueLabelDisplay="auto"
                        />
                    </div>
                </Stack>
            </Collapse>

            {recipes && recipes.data?.length > 0 && (
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">
                        Showing{' '}
                        {((searchParams.page ?? 1) - 1) * (searchParams.limit ?? 10) + 1}-
                        {Math.min((searchParams.page ?? 1) * (searchParams.limit ?? 10), recipes.total)} of {recipes.total}{' '}
                        recipes
                    </Typography>
                    <Pagination
                        count={Math.ceil(recipes.total / (searchParams.limit ?? 10))}
                        page={searchParams.page ?? 1}
                        onChange={handlePageChange}
                    />
                </Stack>
            )}
        </Stack>
    );
}
