// src/app/features/subCategorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

// Fetch subcategories
export const fetchSubCategories = createAsyncThunk(
  "subCategory/getSubCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/subcategories");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create subcategory
export const createSubCategory = createAsyncThunk(
  "subCategory/createSubCategory",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin/subcategories", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete subcategory
export const deleteSubCategory = createAsyncThunk(
  "subCategory/deleteSubCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/subcategories/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState: {
    subCategories: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetSubCategoryState(state) {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories.unshift(action.payload);
        state.success = true;
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = state.subCategories.filter(
          (s) => s._id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSubCategoryState } = subCategorySlice.actions;
export default subCategorySlice.reducer;
