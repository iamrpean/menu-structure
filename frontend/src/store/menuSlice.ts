import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface Menu {
    id: number;
    name: string;
    depth?: number;
    parentId?: number;
    children?: Menu[];
    createdAt?: string;
    updatedAt?: string;
}

interface MenuState {
    menu: Menu | null;
    expandedMenus: { [key: number]: boolean };
    selectedMenu: {
        id: number;
        name: string;
        depth: number;
        parentId: number;
        isNew?: boolean;
    } | null;
    loading: boolean;
    error: string | null;
}

export const fetchMenus = createAsyncThunk('menu/fetchMenus', async () => {
    const response = await fetch('/api/menu');
    if (!response.ok) {
        throw new Error('Failed to fetch menus');
    }
    return await response.json();
});

export const createMenu = createAsyncThunk(
    'menu/createMenu',
    async (menuData: { name: string; parentId?: number }, { dispatch }) => {
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
        const data = await response.json();
        await dispatch(fetchMenus());
        return data;
    }
);

export const updateMenu = createAsyncThunk(
    'menu/updateMenu',
    async (menuData: { id: number; name: string; parent?: number }, { dispatch }) => {
        const response = await fetch(`/api/menu`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(menuData),
        });
        if (!response.ok) {
            throw new Error(`Failed to update menu with ID: ${menuData.id}`);
        }
        const data = await response.json();
        await dispatch(fetchMenus());
        return data;
    }
);

export const deleteMenu = createAsyncThunk(
    'menu/deleteMenu',
    async (id: number, { dispatch }) => {
        const response = await fetch(`/api/menu?id=${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete menu with ID: ${id}`);
        }
        const data = await response.json();
        await dispatch(fetchMenus()); // Refresh data setelah penghapusan
        return data;
    }
);

const calculateDepth = (menu: Menu, parentDepth: number = 0): Menu => {
    const currentDepth = parentDepth + 1;
    return {
        ...menu,
        depth: currentDepth,
        parentId: menu.parentId ?? undefined,
        children: menu.children?.map((child) => calculateDepth(child, currentDepth)) || [],
    };
};

const updateNestedMenu = (menu: Menu, updatedMenu: Menu): Menu => {
    if (menu.id === updatedMenu.id) {
        return { ...menu, ...updatedMenu };
    }
    if (menu.children) {
        return {
            ...menu,
            children: menu.children.map((child) => updateNestedMenu(child, updatedMenu)),
        };
    }
    return menu;
};

const initialState: MenuState = {
    menu: null,
    expandedMenus: {},
    selectedMenu: null,
    loading: false,
    error: null,
};

export const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        toggleMenu: (state, action: PayloadAction<number>) => {
            const menuId = action.payload;
            state.expandedMenus[menuId] = !state.expandedMenus[menuId];
        },
        expandAllMenus: (state) => {
            const expandMenu = (menu: Menu) => {
                state.expandedMenus[menu.id] = true;
                menu.children?.forEach(expandMenu);
            };
            if (state.menu) {
                expandMenu(state.menu);
            }
        },
        collapseAllMenus: (state) => {
            state.expandedMenus = {};
        },
        setSelectedMenu: (
            state,
            action: PayloadAction<{
                id: number;
                name: string;
                depth: number;
                parentId: number;
                isNew?: boolean;
            } | null>
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
                const rootMenuData = action.payload.data.find((m: Menu) => m.parentId === null);
                if (rootMenuData) {
                    const rootMenu = calculateDepth(rootMenuData);
                    state.expandedMenus = {};
                    const initializeExpandedMenus = (menu: Menu) => {
                        state.expandedMenus[menu.id] = false;
                        menu.children?.forEach(initializeExpandedMenus);
                    };
                    initializeExpandedMenus(rootMenu);
                    state.menu = rootMenu;
                } else {
                    state.menu = null;
                }
            })
            .addCase(fetchMenus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch menus';
                state.menu = null;
            })
            .addCase(createMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMenu.fulfilled, (state, action) => {
                state.loading = false;
                if (state.menu && action.payload.data) {
                    const newMenu = calculateDepth({
                        ...action.payload.data,
                        parentId: action.payload.data.parentId ?? undefined,
                    });
                    state.expandedMenus[newMenu.id] = false;
                } else if (!state.menu && action.payload.data.parentId === null) {
                    state.menu = calculateDepth({
                        ...action.payload.data,
                        parentId: undefined,
                    });
                    state.expandedMenus[state.menu.id] = false;
                }
            })
            .addCase(createMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create menu';
            })
            .addCase(updateMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMenu.fulfilled, (state, action) => {
                state.loading = false;
                if (state.menu && action.payload.data) {
                    const updatedMenu = {
                        ...action.payload.data,
                        parentId: action.payload.data.parentId ?? undefined,
                    };
                    state.menu = updateNestedMenu(state.menu, updatedMenu);
                }
            })
            .addCase(updateMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update menu';
            }).addCase(deleteMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMenu.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete menu';
            });
    },
});

export const { toggleMenu, setSelectedMenu, expandAllMenus, collapseAllMenus } = menuSlice.actions;
export default menuSlice.reducer;