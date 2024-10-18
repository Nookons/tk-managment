import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import {IItem} from "../../types/Item";

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

export const fetchItems = createAsyncThunk<IItem[], undefined, { rejectValue: string }>(
    'items/fetchItems',
    async (_, { rejectWithValue }) => {
        try {
            const q = query(collection(db, "warehouse"));
            const querySnapshot = await getDocs(q);

            const employers: IItem[] = [];
            querySnapshot.forEach((doc) => {
                employers.push({
                    ...doc.data() as IItem
                });
            });
            return employers;
        } catch (error) {
            return rejectWithValue('There was an error loading data from the server. Please try again.');
        }
    }
);

const employersSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        addEmployee: (state, action: PayloadAction<IItem>) => {
            const filteredEmployers = state.items.filter(item => item.id !== action.payload.id);
            state.items = [...filteredEmployers, action.payload];
        },
        removeEmployee: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch employers';
            });
    }
});

export const { addEmployee, removeEmployee } = employersSlice.actions;
export default employersSlice.reducer;