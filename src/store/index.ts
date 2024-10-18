import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './reducers/items';

const store = configureStore({
    reducer: {
        robots: itemsReducer,
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;