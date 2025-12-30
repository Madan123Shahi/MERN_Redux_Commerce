import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

// =========================
// FETCH SUBCATEGORIES
// =========================
export const fetchSubCategories = createAsyncThunk(
  "subCategory/getSubCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/subcategories");
      return res.data; // keep full response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// =========================
// CREATE SUBCATEGORY
// =========================
export const createSubCategory = createAsyncThunk(
  "subCategory/createSubCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/admin/subcategories", payload); // data is the created object
      return data; // return object directly
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// =========================
// DELETE SUBCATEGORY
// =========================
export const deleteSubCategory = createAsyncThunk(
  "subCategory/deleteSubCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/subcategories/${id}`);
      return id; // return the deleted ID
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
        state.subCategories = action.payload.subCategories; // ✅ ARRAY
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
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
        state.subCategories.unshift(action.payload); // directly the object
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
