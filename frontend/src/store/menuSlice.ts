import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMenus = createAsyncThunk('menu/fetchMenus', async () => {
  const response = await fetch('/api/menu');
  if (!response.ok) {
    throw new Error('Failed to fetch menus');
  }
  return response.json();
});

export const createMenu = createAsyncThunk(
  'menu/createMenu',
  async (menuData: { name: string; parentId?: number }, thunkAPI) => {
    const response = await fetch('/api/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuData),
    });
    if (!response.ok) {
      throw new Error('Failed to create menu');
    }

    await thunkAPI.dispatch(fetchMenus());

    return response.json();
  }
);

const calculateDepth = (menu: any, parentDepth: number = 0): any => {
  const currentDepth = parentDepth + 1;
  return {
    ...menu,
    depth: currentDepth,
    children: menu.children?.map((child: any) => calculateDepth(child, currentDepth)) || [],
  };
};

export const updateMenu = createAsyncThunk(
  'menu/updateMenu',
  async (menuData: { id: string; name: string; parent?: number }, thunkAPI) => {
    const response = await fetch(`/api/menu`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update menu with ID: ${menuData.id}`);
    }

    await thunkAPI.dispatch(fetchMenus());
    return response.json();
  }
);


interface MenuState {
  menus: any;
  expandedMenus: { [key: string]: boolean };
  selectedMenu: {
    id: string;
    name: string;
    depth: number;
    parent: number;
    isNew?: boolean;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  menus: {},
  expandedMenus: {},
  selectedMenu: null,
  loading: false,
  error: null,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    toggleMenu: (state, action: PayloadAction<string>) => {
      const menuId = action.payload;
      if (state.menus[menuId] === undefined) {
        state.menus[menuId] = false;
      }
      state.menus[menuId] = !state.menus[menuId];
    },
    expandAllMenus: (state) => {
      const expandMenu = (menu: any) => {
        state.expandedMenus[menu.id] = true; // Expand menu ini
        if (menu.children) {
          menu.children.forEach((child: any) => expandMenu(child)); // Rekursif untuk anak-anaknya
        }
      };

      if (Array.isArray(state.menus)) {
        state.menus.forEach((menu: any) => expandMenu(menu)); // Mulai dari root
      }
    },
    collapseAllMenus: (state) => {
      const collapseMenu = (menu: any) => {
        state.expandedMenus[menu.id] = false; // Collapse menu ini
        if (menu.children) {
          menu.children.forEach((child: any) => collapseMenu(child)); // Rekursif untuk anak-anaknya
        }
      };

      if (Array.isArray(state.menus)) {
        state.menus.forEach((menu: any) => collapseMenu(menu)); // Mulai dari root
      }
    },
    setSelectedMenu: (
      state,
      action: PayloadAction<{ id: string; name: string; depth: number; parent: number; isNew?: boolean }>
    ) => {
      state.selectedMenu = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = false;
        const menus = action.payload.data.map((menu: any) => calculateDepth(menu));
      
        // Inisialisasi expandedMenus
        const initializeExpandedMenus = (menu: any) => {
          state.expandedMenus[menu.id] = false; // Default: collapsed
          if (menu.children) {
            menu.children.forEach((child: any) => initializeExpandedMenus(child));
          }
        };
      
        menus.forEach((menu: any) => initializeExpandedMenus(menu));
        state.menus = menus;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch menus';
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.menus.push(action.payload.data);
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create menu';
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        const updatedMenu = action.payload.data;
        state.menus = state.menus.map((menu: any) =>
          menu.id === updatedMenu.id ? updatedMenu : menu
        );
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update menu';
      });
  },
});

export const { toggleMenu, setSelectedMenu, expandAllMenus, collapseAllMenus } = menuSlice.actions;
export default menuSlice.reducer;