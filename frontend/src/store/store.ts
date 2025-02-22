import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./menuSlice";
import sideBarReducer from "./sidebarSlice";

export const store = configureStore({
  reducer: {
    menu: menuReducer, 
    sidebar: sideBarReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
