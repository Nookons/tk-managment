import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";
import {IBrokenRobots} from "../../types/Robot";

type ItemsState = {
    broken_robots: IBrokenRobots[];
    loading: boolean;
    error: string | undefined;
};

const initialState: ItemsState = {
    broken_robots: [],
    loading: false,
    error: undefined,
};

// Создание thunk для подписки на обновления данных
export const subscribeToBroken_robots = createAsyncThunk<void, undefined, { rejectValue: string }>(
    'items/subscribeToItems',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const q = query(collection(db, "/robots_break"));

            // Подписка на изменения в коллекции
            onSnapshot(q, (querySnapshot) => {
                const items: IBrokenRobots[] = [];
                querySnapshot.forEach((doc) => {
                    items.push({
                        ...doc.data() as IBrokenRobots,
                    });
                });
                // Обновляем состояние при каждом изменении
                dispatch(setItems(items));
            });
        } catch (error) {
            return rejectWithValue('There was an error setting up real-time data fetching.');
        }
    }
);

const broken_robotsSlice = createSlice({
    name: 'broken_robots',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<IBrokenRobots[]>) => {
            state.broken_robots = action.payload;
            state.loading = false;
            state.error = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(subscribeToBroken_robots.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(subscribeToBroken_robots.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch items in real-time.';
            });
    }
});

export const { setItems } = broken_robotsSlice.actions;
export default broken_robotsSlice.reducer;
