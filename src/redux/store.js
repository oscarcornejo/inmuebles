import { createStore, compose, applyMiddleware } from 'redux';
import reducers from './reducers/index';
import thunk from 'redux-thunk';

import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = { key: 'sitioAprovechalo', storage };

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(persistedReducer, composeEnhancer(applyMiddleware(thunk)));
const persistor = persistStore(store);

export {store, persistor};