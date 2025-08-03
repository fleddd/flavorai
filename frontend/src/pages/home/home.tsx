import { Link } from "react-router"
import { RecipeCard } from "../../components/home/RecipeItem"
import { useMyRecipesQuery } from "../../hooks/useMyRecipesQuery"
import { PAGES } from "../../config/pages-url.config"

export default function Home() {
    const { data: recipes } = useMyRecipesQuery()
    return (
        <div className="w-full">
            {recipes?.length === 0 && <p className="text-center">There is no recipes. Create it <Link to={PAGES.NEW_RECIPE} className="text-primary">here.</Link></p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {recipes?.map((item) => (
                    <RecipeCard key={item.id} recipe={item} />
                ))}
            </div>
        </div>
    )
}
