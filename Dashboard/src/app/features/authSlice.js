// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../api/axios";

// const initialState = {
//   user: null,
//   loading: false,
//   error: null,
//   success: false,
//   isAuthenticated: false,
//   authChecked: false, // to check if /me was called
// };

// // Login admin
// export const loginAdmin = createAsyncThunk(
//   "auth/loginAdmin",
//   async (form, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post("/auth/loginAdmin", form);
//       return data.admin;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// // Protect admin
// export const protectAdmin = createAsyncThunk(
//   "auth/protectAdmin",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await api.get("/auth/me");
//       return data.user;
//     } catch (err) {
//       return rejectWithValue(null);
//     }
//   }
// );

// export const logoutAdmin = createAsyncThunk(
//   "auth/logoutAdmin",
//   async (_, { rejectWithValue }) => {
//     try {
//       await api.post("/auth/logoutAdmin", {}, { withCredentials: true });
//       return true;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     resetAuthState(state) {
//       state.error = null;
//       state.success = false;
//       state.loading = false;
//     },
//     logout(state) {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // loginAdmin
//       .addCase(loginAdmin.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginAdmin.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//       })
//       .addCase(loginAdmin.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // protectAdmin
//       .addCase(protectAdmin.pending, (state) => {
//         state.loading = true;
//         state.authChecked = false;
//       })
//       .addCase(protectAdmin.fulfilled, (state, action) => {
//         state.user = action.payload;
//         state.isAuthenticated = true;
//         state.loading = false;
//         state.authChecked = true;
//       })
//       .addCase(protectAdmin.rejected, (state) => {
//         state.user = null;
//         state.isAuthenticated = false;
//         state.loading = false;
//         state.authChecked = true;
//       })
//       .addCase(logoutAdmin.fulfilled, (state) => {
//         state.isAuthenticated = false;
//         state.admin = null;
//         state.authChecked = true;
//       });
//   },
// });

// export const { resetAuthState, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

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
      const { data } = await api.post("/auth/refresh");
      return data.accessToken;
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
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- REFRESH ---------- */
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.accessToken = null;
        state.isAuthenticated = false;
        state.authChecked = true;
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
      });
  },
});

export const { resetAuthState, clearAuth } = authSlice.actions;
export default authSlice.reducer;
