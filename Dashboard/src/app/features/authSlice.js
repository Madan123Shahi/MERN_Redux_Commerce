import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
  isAuthenticated: false,
  authChecked: false, // to check if /me was called
};

// Login admin
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (form, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/loginAdmin", form);
      return data.admin;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Protect admin
export const protectAdmin = createAsyncThunk(
  "auth/protectAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/me");
      return data.user;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logoutAdmin", {}, { withCredentials: true });
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState(state) {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginAdmin
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // protectAdmin
      .addCase(protectAdmin.pending, (state) => {
        state.loading = true;
        state.authChecked = false;
      })
      .addCase(protectAdmin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.authChecked = true;
      })
      .addCase(protectAdmin.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.authChecked = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.admin = null;
        state.authChecked = true;
      });
  },
});

export const { resetAuthState, logout } = authSlice.actions;
export default authSlice.reducer;
