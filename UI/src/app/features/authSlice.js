import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios.js";

const initialState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
  success: false, // added for redirect after register/login
};

/* ------------------------------------------
   REGISTER ADMIN
------------------------------------------ */
export const registerAdmin = createAsyncThunk(
  "auth/registerAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/registerAdmin", { email, password });
      return res.data; // expected => { user, accessToken }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

/* ------------------------------------------
   LOGIN ADMIN
------------------------------------------ */
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/loginAdmin", { email, password });
      return res.data; // expected => { user, accessToken }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const protectAdmin = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/me");
      return res.data; // { user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Unauthorized");
    }
  }
);

/* ------------------------------------------
   SLICE
------------------------------------------ */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.success = false;
      state.error = null;
    },
    resetAuthState(state) {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ========================
          REGISTER ADMIN
      ========================== */
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.success = true; // used for redirect
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      /* ========================
          LOGIN ADMIN
      ========================== */
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.success = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(protectAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(protectAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(protectAdmin.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
      });
  },
});

export const { logout, resetAuthState } = authSlice.actions;

export default authSlice.reducer;
