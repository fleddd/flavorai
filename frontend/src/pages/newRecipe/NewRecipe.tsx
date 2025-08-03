import { useMutation } from '@tanstack/react-query';
import {
    Controller,
    FormProvider,
    useForm,
    type SubmitHandler,
} from 'react-hook-form';
import { recipeService } from '../../services/recipe.service';
import { useNavigate } from 'react-router';
import type { CreateRecipeDto } from '../../types/recipe.types';
import { toast } from 'react-toastify';
import { PAGES } from '../../config/pages-url.config';
import {
    MenuItem,
    TextareaAutosize,
    TextField,
    Typography,
    Box,
    Divider,
    useTheme,
    useMediaQuery,
    Stack,
    Select,
    Paper,
} from '@mui/material';

import { PrimaryButton } from '../../shared/components/buttons/PrimaryButton';
import { CuisineEnum } from '../../constants/enums';
import ImageUploader from './ImageUploader';
import { IngredientsInput } from './Ingredients';

function NewRecipe() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const methods = useForm<CreateRecipeDto>({
        mode: 'onTouched',
        defaultValues: {
            cuisineType: CuisineEnum.OTHER as keyof typeof CuisineEnum,
        },
    });
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        control,
    } = methods;

    const { mutate } = useMutation({
        mutationKey: ['newRecipe'],
        mutationFn: (data: CreateRecipeDto) => recipeService.create(data),
        onSuccess: () => {
            reset();
            toast.success('Recipe created successfully');
            navigate(PAGES.HOME, { replace: true });
        },
        onError: (_error) => {
            toast.error(_error?.message ?? 'Failed to create recipe');
        },
    });

    const onSubmit: SubmitHandler<CreateRecipeDto> = (data) => {
        mutate(data);
    };

    return (
        <FormProvider {...methods}>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    width: '90%',
                    maxWidth: 800,
                    mx: 'auto',
                    p: isMobile ? 1 : 2,
                }}
                noValidate
            >
                <Paper elevation={2} sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: '#627f34',
                            mb: 2,
                            fontWeight: 600,
                            textAlign: 'center',
                        }}
                    >
                        New Recipe
                    </Typography>

                    <Stack spacing={2}>
                        {/* Basic Info */}
                        <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Title"
                                error={!!errors.title}
                                helperText={errors.title?.message}
                                {...register('title', { required: 'Title is required' })}
                                disabled={isSubmitting}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Cook Time (mins)"
                                error={!!errors.timeToCook}
                                helperText={errors.timeToCook?.message}
                                {...register('timeToCook', {
                                    required: 'Cook time is required',
                                    valueAsNumber: true,
                                    min: { value: 1, message: 'Must be at least 1 minute' },
                                })}
                                disabled={isSubmitting}
                            />
                        </Stack>

                        <Controller
                            name="cuisineType"
                            control={control}
                            rules={{ required: 'Cuisine is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    size="small"
                                    fullWidth
                                    error={!!errors.cuisineType}
                                    disabled={isSubmitting}
                                >
                                    {Object.values(CuisineEnum).map((cuisine) => (
                                        <MenuItem key={cuisine} value={cuisine}>
                                            {cuisine}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.cuisineType && (
                            <Typography variant="caption" color="error">
                                {errors.cuisineType.message}
                            </Typography>
                        )}

                        <TextField
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            label="Description"
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            {...register('description', { required: 'Description is required' })}
                            disabled={isSubmitting}
                        />

                        {/* Image Upload */}
                        <Box
                            sx={{
                                border: '1px dashed #ddd',
                                borderRadius: 1,
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ImageUploader />
                        </Box>

                        {/* Ingredients */}
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: '#627f34' }}>
                                Ingredients
                            </Typography>
                            <IngredientsInput />
                        </Box>

                        {/* Instructions */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: '#627f34' }}>
                                Instructions
                            </Typography>
                            <TextareaAutosize
                                minRows={4}
                                placeholder="Step-by-step instructions..."
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: errors.instructions
                                        ? '1px solid #d32f2f'
                                        : '1px solid rgba(0, 0, 0, 0.23)',
                                    fontFamily: 'inherit',
                                    fontSize: '0.875rem',
                                    resize: 'vertical',
                                }}
                                {...register('instructions', { required: 'Instructions are required' })}
                                disabled={isSubmitting}
                            />
                            {errors.instructions && (
                                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                                    {errors.instructions.message}
                                </Typography>
                            )}
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <PrimaryButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Recipe'}
                        </PrimaryButton>
                    </Stack>
                </Paper>
            </Box>
        </FormProvider>
    );
}

export default NewRecipe;
