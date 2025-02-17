import { useState } from "react";
import { useRecipesContext } from "../hooks/useRecipesContext";
import { useAuthContext } from "../hooks/useAuthContext";

const RecipeDetails = ({ recipe }) => {
  const { dispatch, favorites } = useRecipesContext();
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: recipe.name,
    ingredients: recipe.ingredients.join(", "),
    instructions: recipe.instructions,
    prepTime: recipe.prepTime,
    difficulty: recipe.difficulty,
  });

  // Check if the recipe is already a favorite
  const isFavorite = Array.isArray(favorites) && favorites.some((fav) => fav._id === recipe._id);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    const updatedRecipe = {
      ...formData,
      ingredients: formData.ingredients.split(","),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}${recipe._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(updatedRecipe),
        }
      );

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "UPDATE_RECIPE", payload: json });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const handleFavorite = () => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: recipe });
  };

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "DELETE_RECIPE", payload: json });
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div className="workouts">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <label>Recipe Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
          />

          <label>Ingredients (comma-separated):</label>
          <input
            type="text"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleFormChange}
          />

          <label>Cooking Instructions:</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleFormChange}
          />

          <label>Preparation Time (in minutes):</label>
          <input
            type="number"
            name="prepTime"
            value={formData.prepTime}
            onChange={handleFormChange}
          />

          <label>Difficulty Level:</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleFormChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button type="submit">Save Changes</button>
          <button type="button" onClick={handleEditClick}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h4>{recipe.name}</h4>
          <p>
            <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
          </p>
          <p>
            <strong>Instructions:</strong> {recipe.instructions}
          </p>
          <p>
            <strong>Prep Time:</strong> {recipe.prepTime} minutes
          </p>
          <p>
            <strong>Difficulty:</strong> {recipe.difficulty}
          </p>
          <div>
            <button onClick={handleEditClick}>Edit</button>
            <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
              Delete
            </button>
            <button onClick={handleFavorite} style={{ marginLeft: "10px" }}>
              {isFavorite ? "❤️ Unfavorite" : "♡ Favorite"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeDetails;
