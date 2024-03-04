import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    name: null,
    objective: null,
    username: null,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
   saveDetails: (state, action) => {

    console.log(action.payload)
    state.token = action.payload.deptToken;
    state.name = action.payload.departmentName;
    state.objective = action.payload.departmentObjective;
    state.username = action.payload.username;

    console.log(state.name);
   },
   deleteDetails: (state) => {
    state.token = null;
    state.name = null;
    state.objective = null;
    state.username = null;
   }
  },
});

export const { saveDetails, deleteDetails } = departmentSlice.actions;
export default departmentSlice.reducer;
