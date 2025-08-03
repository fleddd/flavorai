import { CuisineEnum } from "../constants/enums";

export interface Recipe {
    id: string;
    title: string;
    timeToCook: number;
    description: string;
    instructions: string;
    cuisineType: keyof typeof CuisineEnum;
    imageUrl?: string | null;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    ingredients: RecipeIngredient[];
    rating: number;
    images: RecipeImage[];
}

export interface Ingredient {
    id: string;
    name: string;
}
export interface RecipeIngredient {
    id: string;
    quantity: string;
    weight: number;
    recipeId: string;
    ingredientId: string;
    ingredient: Ingredient;
}

export interface Rating {
    id: string;
    stars: number;
}
export interface RecipeImage {
    id: string;
    imageUrl: string;
    uploadedAt: string;
    recipeId: string;
}





export interface CreateRecipeDto {
    title: string;
    timeToCook: number;
    description: string;
    instructions: string;
    cuisineType: keyof typeof CuisineEnum;
    imageUrl?: string | null;
    ingredients: CreateRecipeIngredientDto[];
}

export interface UpdateRecipeDto extends Partial<CreateRecipeDto> { }


export interface UploadImageDto {
    image: File;
}

export interface CreateRecipeIngredientDto {
    ingredientId: string;
    quantity: string;
    weight: number;
}

export interface SearchParams {
    query?: string;
    cuisines: string[];
    timeMin?: number;
    timeMax?: number;
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}