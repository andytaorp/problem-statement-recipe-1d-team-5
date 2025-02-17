import { useRecipesContext } from '../hooks/useRecipesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect } from 'react';
import RecipeDetails from './RecipeDetails';

const FavoriteRecipes = () => {
    const { favorites = [], dispatch } = useRecipesContext();  // Default to empty array if favorites is undefined
    const { user } = useAuthContext();

    // Fetch favorite recipes on component mount
    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) return;

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/favorites`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_FAVORITES', payload: json });
            }
        };

        fetchFavorites();
    }, [user, dispatch]);

    const handleRemoveFavorite = async (recipeId) => {
        if (!user) return;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/favorites/${recipeId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user.token}`,
            },
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'REMOVE_FAVORITE', payload: json });
        }
    };

    return (
        <div className="favorite-recipes">
            <h3>Favorite Recipes</h3>
            {favorites.length === 0 ? (
                <p>You don't have any favorite recipes yet.</p>
            ) : (
                favorites.map((recipe) => (
                    <div key={recipe._id}>
                        <RecipeDetails recipe={recipe} />
                    </div>
                ))
            )}
        </div>
    );
};

export default FavoriteRecipes;
