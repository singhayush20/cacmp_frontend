import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice'
import departmentSlice from './slices/departmentSlice';
import adminSlice from './slices/adminSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        department: departmentSlice,
        admin: adminSlice
    }

});


export default store;