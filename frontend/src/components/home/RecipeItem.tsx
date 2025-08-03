import { Link } from "react-router";
import { PAGES } from "../../config/pages-url.config";
import type { Recipe } from "../../types/recipe.types";

export const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
    return (
        <div className=" bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <img

                src={recipe.imageUrl || ""}
                alt={recipe.title}
                className="w-full h-48 object-contain"
            />
            <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{recipe.title}</h2>
                <p className="text-sm text-gray-500 mb-2">
                    {recipe.cuisineType} • {recipe.timeToCook} mins
                </p>
                <p className="text-gray-700 text-sm mb-4">{recipe.description}</p>



                <div className="flex items-center justify-between">
                    <Link to={PAGES.RECIPE_DETAILS(recipe.id)} className="text-primary font-semibold text-end w-full">View Recipe</Link>
                </div>
            </div>
        </div>
    );
};
