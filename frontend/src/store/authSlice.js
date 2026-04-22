import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("adams_token"),
  user: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload?.token || null;
      state.user = action.payload?.user || null;
      if (state.token) {
        localStorage.setItem("adams_token", state.token);
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("adams_token");
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
