import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IUser} from "../../types/User";

type ItemsState = {
    user: IUser | null;
    loading: boolean;
    error: string | undefined;
};

const initialState: ItemsState = {
    user: null,
    loading: false,
    error: undefined,
};

const userReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userEnter: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        },
    },
});

export const { userEnter } = userReducer.actions;
export default userReducer.reducer;
