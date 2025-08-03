import { useQuery } from "@tanstack/react-query"
import type { Recipe } from "../types/recipe.types"
import { recipeService } from "../services/recipe.service"


export const useMyRecipesQuery = () => {
    return useQuery<Recipe[]>({
        queryKey: ["recipes"],
        queryFn: () => recipeService.getMyRecipes().then(res => res.data),
    })
}