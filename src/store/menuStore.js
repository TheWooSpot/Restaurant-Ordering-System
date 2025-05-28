import { create } from 'zustand';

export const useMenuStore = create((set, get) => ({
  menuItems: [],
  categories: [],
  selectedCategory: 'all',

  setMenuItems: (items) => {
    const categories = [...new Set(items.map(item => item.category))];
    set({ 
      menuItems: items,
      categories: categories
    });
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  getFilteredMenuItems: () => {
    const { menuItems, selectedCategory } = get();
    if (selectedCategory === 'all') return menuItems;
    return menuItems.filter(item => item.category === selectedCategory);
  },

  getMenuItemById: (id) => {
    return get().menuItems.find(item => item.id === id);
  },

  getPopularItems: () => {
    return get().menuItems
      .filter(item => item.popular)
      .slice(0, 4);
  }
}));
