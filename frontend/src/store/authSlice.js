import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  status: "idle",
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload?.token || null;
      state.user = action.payload?.user || null;
      state.status = "succeeded";
      state.error = null;
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    }
  }
});

export const { setCredentials, clearCredentials, setAuthError } = authSlice.actions;
export default authSlice.reducer;
