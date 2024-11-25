import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";
import { IItem } from "../../types/Item";

type ItemsState = {
    items: IItem[];
    loading: boolean;
    error: string | undefined;
};

const initialState: ItemsState = {
    items: [],
    loading: false,
    error: undefined,
};

// Создание thunk для подписки на обновления данных
export const subscribeToItems = createAsyncThunk<void, undefined, { rejectValue: string }>(
    'items/subscribeToItems',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const q = query(collection(db, "/warehouse"));

            // Подписка на изменения в коллекции
            onSnapshot(q, (querySnapshot) => {
                const items: IItem[] = [];
                querySnapshot.forEach((doc) => {
                    items.push({
                        ...doc.data() as IItem,
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

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<IItem[]>) => {
            state.items = action.payload;
            state.loading = false;
            state.error = undefined;
        },
        removeItems: (state, action: PayloadAction<any[]>) => {
            state.items = state.items.filter(item => !action.payload.includes(item.id));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(subscribeToItems.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(subscribeToItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch items in real-time.';
            });
    }
});

export const { setItems, removeItems } = itemsSlice.actions;
export default itemsSlice.reducer;
