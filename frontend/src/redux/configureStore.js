import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./userSlice";
import cardReducer from "./cardSlice";
import paymentReducer from "./paymentSlice";
import statementReducer from "./statementSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "card"],
};

const rootReducer = combineReducers({
  user: userReducer,
  card: cardReducer,
  payment: paymentReducer,
  statement: statementReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };
