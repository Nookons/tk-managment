import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './reducers/items';
import totesReducer from './reducers/totes';
import userReducer from './reducers/user';

const store = configureStore({
    reducer: {
        items: itemsReducer,
        totes: totesReducer,
        user: userReducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;