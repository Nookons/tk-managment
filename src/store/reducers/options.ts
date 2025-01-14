import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";
import {IOption} from "../../types/Option";

type ItemsState = {
    options: IOption[];
    loading: boolean;
    error: string | undefined;
};

const initialState: ItemsState = {
    options: [],
    loading: false,
    error: undefined,
};

export const subscribeToOptions = createAsyncThunk<void, undefined, { rejectValue: string }>(
    'items/subscribeToOptions',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const q = query(collection(db, "/item_library"));

            // Подписка на изменения в коллекции
            onSnapshot(q, (querySnapshot) => {
                const items: IOption[] = [];
                querySnapshot.forEach((doc) => {
                    items.push({
                        ...doc.data() as IOption,
                    });
                });
                dispatch(setItems(items));
            });
        } catch (error) {
            return rejectWithValue('There was an error setting up real-time data fetching.');
        }
    }
);

const optionsSlicer = createSlice({
    name: 'options',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<IOption[]>) => {
            state.options = action.payload;
            state.loading = false;
            state.error = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(subscribeToOptions.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(subscribeToOptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch items in real-time.';
            });
    }
});

export const { setItems } = optionsSlicer.actions;
export default optionsSlicer.reducer;
