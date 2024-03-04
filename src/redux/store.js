import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice'
import departmentSlice from './slices/departmentSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        department: departmentSlice,
    }

});


export default store;