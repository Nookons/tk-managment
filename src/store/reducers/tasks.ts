import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";
import {ITaskRecord} from "../../types/Task";

type ItemsState = {
    tasks: ITaskRecord[];
    loading: boolean;
    error: string | undefined;
};

const initialState: ItemsState = {
    tasks: [],
    loading: false,
    error: undefined,
};

// Создание thunk для подписки на обновления данных
export const subscribeToTasks = createAsyncThunk<void, undefined, { rejectValue: string }>(
    'items/subscribeToTasks',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const q = query(collection(db, "/tasks_record"));

            // Подписка на изменения в коллекции
            onSnapshot(q, (querySnapshot) => {
                const items: ITaskRecord[] = [];
                querySnapshot.forEach((doc) => {
                    items.push({
                        ...doc.data() as ITaskRecord,
                    });
                });
                // Обновляем состояние при каждом изменении
                dispatch(setTasks(items));
            });
        } catch (error) {
            return rejectWithValue('There was an error setting up real-time data fetching.');
        }
    }
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<ITaskRecord[]>) => {
            state.tasks = action.payload;
            state.loading = false;
            state.error = undefined;
        },
        removeTasks: (state, action: PayloadAction<any[]>) => {
            state.tasks = state.tasks.filter(item => !action.payload.includes(item.id));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(subscribeToTasks.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(subscribeToTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch tasks in real-time.';
            });
    }
});

export const { setTasks, removeTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
