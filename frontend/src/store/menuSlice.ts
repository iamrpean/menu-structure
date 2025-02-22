import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
  menus: Record<string, boolean>;
  selectedMenu: {
    id: string;
    name: string;
    depth: number;
    parent: string;
    isNew?: boolean;
  } | null;
}

const initialState: MenuState = {
  menus: {},
  selectedMenu: null,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    toggleMenu: (state, action: PayloadAction<string>) => {
      const menuId = action.payload;
      state.menus[menuId] = !state.menus[menuId];
    },
    expandAllMenus: (state) => {
      Object.keys(state.menus).forEach((key) => {
        state.menus[key] = true;
      });
    },
    collapseAllMenus: (state) => {
      Object.keys(state.menus).forEach((key) => {
        state.menus[key] = false;
      });
    },
    setSelectedMenu: (
      state,
      action: PayloadAction<{ id: string; name: string; depth: number; parent: string; isNew?: boolean }>
    ) => {
      state.selectedMenu = action.payload;
    },
  },
});

export const { toggleMenu, expandAllMenus, collapseAllMenus, setSelectedMenu } = menuSlice.actions;
export default menuSlice.reducer;