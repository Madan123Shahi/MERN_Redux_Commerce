// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../app/features/authSlice.js";
import categoryReducer from "../app/features/categorySlice.js";
import subCategoryReducer from "../app/features/subCategorySlice.js";
import productReducer from "../app/features/productSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    subCategory: subCategoryReducer,
    product: productReducer,
  },
});
