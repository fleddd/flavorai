import { useQuery } from "@tanstack/react-query"
import { recipeService } from "../services/recipe.service"
import type { PaginatedResponse, Recipe, SearchParams } from "../types/recipe.types";

export const useSearchRecipesQuery = (params: SearchParams) => {
    return useQuery<PaginatedResponse<Recipe[]>>({
        queryKey: ['search', params],
        queryFn: () => recipeService.search(params).then(res => res.data),
        enabled: Boolean(
            params.query ||
            params.cuisines ||
            (params.timeMax && params.timeMax !== 120)
        ),
    });
};