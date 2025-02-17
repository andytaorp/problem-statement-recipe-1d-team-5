import { useAuthContext } from "./useAuthContext";
import { useRecipesContext } from './useRecipesContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext(); // Correct destructuring
    const { dispatch: dispatchRecipes } = useRecipesContext();

    const logout = () => {
        localStorage.removeItem('user')

        dispatch({ type: "LOGOUT" });

        // Clear recipes in RecipesContext
        dispatchRecipes({ type: "SET_RECIPES", payload: [] }); // Set to an empty array
    }

    return { logout }
}

