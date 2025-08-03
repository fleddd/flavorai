import { useQuery } from "@tanstack/react-query"
import { ingredientService } from "../services/ingredient.service"
import type { Ingredient } from "../types/recipe.types"


export const useIngredientsQuery = () => {
    return useQuery<Ingredient[]>({
        queryKey: ["ingredients"],
        queryFn: () => ingredientService.getAll().then(res => res.data),
    })
}