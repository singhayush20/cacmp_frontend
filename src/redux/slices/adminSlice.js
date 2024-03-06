import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   token:null,
   name:null,
   username: null,
   roles: null
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
   saveDetails: (state, action) => {
    state.token = action.payload.userToken;
    state.username = action.payload.username;
    state.name= action.payload.name;
    state.roles= action.payload.roles

   },
   deleteDetails: (state) => {
    state.token = null;
    state.username =  null;
    state.name= null;
    state.roles= null;
   }
  },
});

export const { saveDetails, deleteDetails } = adminSlice.actions;
export default adminSlice.reducer;
