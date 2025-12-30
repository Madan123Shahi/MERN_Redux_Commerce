import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { setAuthToken } from "../../api/axios";

const initialState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  authChecked: false,
};

/* =========================
   LOGIN ADMIN
========================= */
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (form, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/loginAdmin", form);
      return data; // { accessToken, admin }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* =========================
   REFRESH ACCESS TOKEN
========================= */
export const refreshAccessToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/refresh"); // backend returns { accessToken, user }
      // Set token in Axios for future requests
      setAuthToken(data.accessToken);
      return data; // Return full object
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

/* =========================
   GET CURRENT ADMIN
========================= */
export const protectAdmin = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/me");
      return data.user;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

/* =========================
   LOGOUT ADMIN
========================= */
export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logoutAdmin");
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
      state.loading = false;
      state.error = null;
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.authChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ---------- LOGIN ---------- */
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.admin;
        state.accessToken = action.payload.accessToken;
        state.authChecked = true;
        // 🔑 SET TOKEN HERE
        setAuthToken(action.payload.accessToken);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user; // restore user
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.accessToken = null;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
        setAuthToken(null); // remove token
      })

      /* ---------- ME ---------- */
      .addCase(protectAdmin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      /* ---------- LOGOUT ---------- */
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.authChecked = true;
        setAuthToken(null); // remove header
      });
  },
});

export const { resetAuthState, clearAuth } = authSlice.actions;
export default authSlice.reducer;
