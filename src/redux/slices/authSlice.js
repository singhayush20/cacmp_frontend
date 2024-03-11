import { createSlice } from "@reduxjs/toolkit";

// Load initial state from local storage if available
const initialState = {
  status: localStorage.getItem("isLoggedIn") === "true",
  loggedInAccountType: localStorage.getItem("loggedInAccountType"),
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
      state.loggedInAccountType = action.payload.loggedInAccountType;
      // Persist login status and user data to local storage
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("loggedInAccountType", action.payload.loggedInAccountType);
      localStorage.setItem("userData", JSON.stringify(action.payload.userData));
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.loggedInAccountType = null;
      // Clear login status and user data from local storage
      localStorage.removeItem("loggedInAccountType");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userData");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
