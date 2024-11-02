import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";
import { IItem } from "../../types/Item";

type ItemsState = {
    totes: any[];
    loading: boolean;
    error: string | undefined;
};

const initialState: ItemsState = {
    totes: [],
    loading: false,
    error: undefined,
};

// Создание thunk для подписки на обновления данных
export const subscribeToTotes = createAsyncThunk<void, undefined, { rejectValue: string }>(
    'items/subscribeToTotes',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const q = query(collection(db, "/tote_info"));

            // Подписка на изменения в коллекции
            onSnapshot(q, (querySnapshot) => {
                const items: any[] = [];
                querySnapshot.forEach((doc) => {
                    items.push({
                        ...doc.data() as IItem,
                    });
                });
                dispatch(setItems(items));
            });
        } catch (error) {
            return rejectWithValue('There was an error setting up real-time data fetching.');
        }
    }
);

const totesSlicer = createSlice({
    name: 'totes',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<any[]>) => {
            state.totes = action.payload;
            state.loading = false;
            state.error = undefined;
        },
        removeTote: (state, action: PayloadAction<any[]>) => {
            state.totes = state.totes.filter(item => !action.payload.includes(item.id));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(subscribeToTotes.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(subscribeToTotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch items in real-time.';
            });
    }
});

export const { setItems, removeTote } = totesSlicer.actions;
export default totesSlicer.reducer;
