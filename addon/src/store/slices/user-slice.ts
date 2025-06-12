import { createSlice } from '@reduxjs/toolkit'

export interface UserState {
  authToken: string | null;
}

const initialState: UserState = {
  authToken: null,
};

export const userSlice = createSlice({
  name: 'USER_SLICE',
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
  },
})

export const { setAuthToken } = userSlice.actions;
export default userSlice.reducer;