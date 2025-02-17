import { createContext, useReducer } from 'react';

export const RecipesContext = createContext();

export const recipesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_RECIPE':
            return {
                recipes: action.payload, // Replace the existing recipes with the payload
            };
        case 'CREATE_RECIPE':
            return {
                recipes: [action.payload, ...state.recipes], // Add a new recipe to the list
            };
        case 'DELETE_RECIPE': // Fix the action type to match dispatch calls
            return {
                recipes: state.recipes.filter((recipe) => recipe._id !== action.payload._id), // Remove the recipe by ID
            };
        case "UPDATE_RECIPE":
            return {
                recipes: state.recipes.map((recipe) =>
                    recipe._id === action.payload._id ? action.payload : recipe
                ),
            };
        case 'TOGGLE_FAVORITE':
            const favorites = Array.isArray(state.favorites) ? state.favorites : [];
            const isFavorite = favorites.find((r) => r._id === action.payload._id);
            return {
                ...state,
                favorites: isFavorite
                    ? favorites.filter((r) => r._id !== action.payload._id)
                    : [...favorites, action.payload]
            }
        case 'SET_FAVORITES': 
            return {
                ...state,
                favorites: action.payload,
            }
        default:
            console.log("Unknown action type:", action.type);
            return state;
    }
};

export const RecipesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(recipesReducer, { recipes: [], favorites: [] });

    return (
        <RecipesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </RecipesContext.Provider>
    )
}