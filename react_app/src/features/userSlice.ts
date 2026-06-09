import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name: string;
}

const USER_KEY = "wt_user";

const initialState: UserState = {
  // Restore the last username so it survives reloads (localStorage).
  name: localStorage.getItem(USER_KEY) || "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      localStorage.setItem(USER_KEY, action.payload);
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
