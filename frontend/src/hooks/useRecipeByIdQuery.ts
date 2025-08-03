import { useQuery } from "@tanstack/react-query"
import type { Recipe } from "../types/recipe.types"
import { recipeService } from "../services/recipe.service"


export const useRecipeByIdQuery = (id: string) => {
    return useQuery<Recipe>({
        queryKey: ["recipe", id],
        queryFn: () => recipeService.getById(id).then(res => res.data),
    })
}