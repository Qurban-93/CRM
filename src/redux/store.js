// import { createStore ,  combineReducers, compose , applyMiddleware} from 'redux';
// import {thunk} from 'redux-thunk';
import { authApi } from '../redux/api/authApi';
import { userApi } from '../redux/api/userApi';
import { teamsApi } from '../redux/api/teamsApi';
import { projectsApi } from './api/projectsApi';
import { raportApi } from './api/raportApi';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import userSlice from "./features/user/userSlice";
import modalsSlice from './features/modals/modalsSlice';
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    persistStore,
    persistReducer
} from "redux-persist";


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['userSlice']
}

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [teamsApi.reducerPath]: teamsApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [raportApi.reducerPath]: raportApi.reducer,
    userSlice,
    modalsSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const stringMiddleware = () => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action);
}

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }).concat(stringMiddleware,
        authApi.middleware,
        userApi.middleware,
        teamsApi.middleware,
        projectsApi.middleware,
        raportApi.middleware),
    devTools: true
})

export const persistor = persistStore(store)
export default store;