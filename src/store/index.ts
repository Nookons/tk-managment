import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './reducers/items';
import totesReducer from './reducers/totes';
import userReducer from './reducers/user';
import brokenRobotsReducer from './reducers/broken_robots';
import optionsReducer from './reducers/options';

const store = configureStore({
    reducer: {
        items: itemsReducer,
        totes: totesReducer,
        user: userReducer,
        options: optionsReducer,
        broken_robots: brokenRobotsReducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;