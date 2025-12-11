import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../app/features/authSlice.js";

export const store = configureStore({
  reducer: { auth: authReducer },
});
