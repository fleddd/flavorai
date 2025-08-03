import { axiosWithAuth } from "../api/interceptors";
import type { Ingredient } from "../types/recipe.types";

class IngredientService {
    getAll() {
        return axiosWithAuth.get<Ingredient[]>('/ingredients');
    }
};
export const ingredientService = new IngredientService();