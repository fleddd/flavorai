import { useNavigate, useParams } from "react-router";
import { useRecipeByIdQuery } from "../../hooks/useRecipeByIdQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Box,
    Typography,
    Stack,
    Divider,
    Container,
    useMediaQuery,
    useTheme,
    Chip,
    Paper,
    Rating,
    IconButton,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { recipeService } from "../../services/recipe.service";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { PAGES } from "../../config/pages-url.config";

function ViewRecipe() {
    const id = useParams().id!;
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const { data: recipe } = useRecipeByIdQuery(id);
    const queryClient = useQueryClient();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        if (recipe?.rating !== undefined) {
            setRating(recipe.rating);
        }
    }, [recipe]);

    const mutation = useMutation({
        mutationFn: (newRating: number) => recipeService.rateRecipe(id, newRating),
        onSuccess: () => {
            toast.success("Rating updated!");
            queryClient.invalidateQueries({ queryKey: ["recipe", id] });
        },
        onError: () => toast.error("Failed to update rating"),
    });

    const deleteMutation = useMutation({
        mutationFn: () => recipeService.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["recipes"] });
            navigate(PAGES.HOME, { replace: true });
            toast.success("Recipe deleted!");
        },
        onError: () => toast.error("Failed to delete recipe"),
    })



    const onClickDelete = () => {
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
        deleteMutation.mutate()
    }


    const createdDate = useMemo(
        () => (recipe ? new Date(recipe.createdAt).toLocaleDateString() : ""),
        [recipe]
    );

    if (!recipe) return <div>Recipe not found</div>;

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: 2,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
                justifyContent: "center",
                alignItems: "flex-start",
            }}
        >
            <Paper
                elevation={4}
                sx={{ borderRadius: 4, p: { xs: 2, sm: 4 }, flex: { md: 2 } }}
            >
                <Box display="flex" flexDirection="column" gap={3}>
                    <Typography
                        variant={isMobile ? "h5" : "h4"}
                        fontWeight="bold"
                        textAlign="center"
                        sx={{ color: "#627f34" }}
                    >
                        {recipe.title}
                    </Typography>

                    {recipe.imageUrl && (
                        <Box
                            component="img"
                            src={recipe.imageUrl}
                            alt="Recipe"
                            sx={{
                                width: "100%",
                                height: isMobile ? 200 : 350,
                                objectFit: "contain",
                                borderRadius: 3,
                            }}
                        />
                    )}

                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        justifyContent="center"
                        gap={1}
                    >
                        <Chip
                            label={`Cuisine: ${recipe.cuisineType}`}
                            sx={{ bgcolor: "#627f34", color: "white" }}
                        />
                        <Chip label={`Cook Time: ${recipe.timeToCook} min`} />
                        <Chip label={`Created: ${createdDate}`} variant="outlined" />
                    </Stack>

                    <Stack width={"100%"} justifyContent="center" alignItems={"center"} direction="row" spacing={1} >
                        <Rating
                            value={rating}
                            precision={0.5}
                            onChange={(_, newValue) => {
                                if (newValue !== null) {
                                    setRating(newValue);
                                    mutation.mutate(newValue);
                                }
                            }}
                            disabled={mutation.isPending}
                        />
                        <IconButton color="error">
                            <DeleteIcon onClick={onClickDelete} />
                        </IconButton>
                    </Stack>

                    <Divider />

                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ color: "#627f34" }}>
                            Description
                        </Typography>
                        <Typography color="text.secondary">{recipe.description}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ color: "#627f34" }}>
                            Instructions
                        </Typography>
                        <Typography whiteSpace="pre-line" color="text.secondary">
                            {recipe.instructions}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ color: "#627f34" }}>
                            Ingredients
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, m: 0 }}>
                            {recipe.ingredients.map((item) => (
                                <li key={item.id}>
                                    <Typography variant="body2">
                                        {item.ingredient?.name ?? "Unknown"} — {item.quantity} (
                                        {item.weight}g)
                                    </Typography>
                                </li>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container >
    );
}

export default ViewRecipe;
