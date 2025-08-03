import { axiosWithAuth } from "../api/interceptors";
import type { CreateRecipeDto, PaginatedResponse, Recipe, SearchParams } from "../types/recipe.types";

class RecipeService {
    private baseUrl = '/recipes';

    create(data: CreateRecipeDto) {
        return axiosWithAuth.post<Recipe>(this.baseUrl, data);
    }

    getById(id: string) {
        return axiosWithAuth.get<Recipe>(`${this.baseUrl}/${id}`);
    }

    getMyRecipes() {
        return axiosWithAuth.get<Recipe[]>(`${this.baseUrl}/my`);
    }
    delete(id: string) {
        return axiosWithAuth.delete(`${this.baseUrl}/${id}`);
    }

    search(params: SearchParams) {
        const searchParams = {
            ...params,
            cuisines: params.cuisines?.join(',')
        };

        const cleanedParams = Object.fromEntries(
            Object.entries(searchParams).filter(
                ([_e, value]) => value !== undefined && value !== null && value !== ''
            )
        );

        return axiosWithAuth.get<PaginatedResponse<Recipe[]>>(
            `${this.baseUrl}/search`,
            { params: cleanedParams }

        )
    };

    async rateRecipe(recipeId: string, rating: number) {
        await axiosWithAuth.post(`${this.baseUrl}/rate/${recipeId}`, { rating });
    }
}
export const recipeService = new RecipeService();


