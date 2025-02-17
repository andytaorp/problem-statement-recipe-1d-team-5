import { useEffect, useState } from "react";
import { useRecipesContext } from "../hooks/useRecipesContext";
import RecipeDetails from "../components/RecipeDetails";
import RecipeForm from "../components/RecipeForm";
import FavoriteRecipes from "../components/FavoriteRecipes";
import SearchBar from '../components/SearchBar';

import { useAuthContext } from "../hooks/useAuthContext";

const Home = () => {
  const { recipes, dispatch } = useRecipesContext();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(''); // To track sorting option

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const json = await response.json();

        if (response.ok) {
          dispatch({ type: "SET_RECIPE", payload: json });
        } else {
          console.error("Failed to fetch recipes:", json.error);
        }
      } catch (error) {
        console.error("An error occurred while fetching recipes:", error);
      }
    };

    if (user) {
      fetchRecipes();
    }
  }, [dispatch, user]);

  const filteredItems = recipes
    ? recipes.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Sort the recipes when the sortBy option changes
  const sortedRecipes = filteredItems ? [...filteredItems] : [];

  if (sortBy === "prepTime") {
    sortedRecipes.sort((a, b) => a.prepTime - b.prepTime); // Sort by preparation time
  } else if (sortBy === "difficulty") {
    const difficultyOrder = ["easy", "medium", "hard"]; // Difficulty level order
    sortedRecipes.sort((a, b) => difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty));
  }

  return (
    <div className="home">
      <div>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {/* Sorting Dropdown */}
        <div>
          <label>Sort By:</label>
          <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
            <option value="">Select</option>
            <option value="prepTime">Preparation Time</option>
            <option value="difficulty">Difficulty Level</option>
          </select>
        </div>

        <div>
          {sortedRecipes.map((recipe) => (
            <RecipeDetails recipe={recipe} key={recipe._id} />
          ))}
        </div>
      </div>
      <RecipeForm />
      <FavoriteRecipes />
    </div>
  );
};

export default Home;
