import { createSlice } from "@reduxjs/toolkit";

// Load initial state from local storage if available
const initialState = {
  status: localStorage.getItem("isLoggedIn") === "true",
  userData: localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
      // Persist login status and user data to local storage
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("userData", JSON.stringify(action.payload.userData));
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      // Clear login status and user data from local storage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userData");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
