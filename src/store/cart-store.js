import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialState = {
  items: [],
};

export const useCartStore = create()(
  persist(
    (set) => ({
      ...initialState,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);

          if (!existing) {
            return {
              items: [...state.items, { ...item, quantity: item.quantity || 1 }],
            };
          }

          return {
            items: state.items.map((i) =>
              i.id === item.id
                ? {
                  ...i,
                  quantity: (i.quantity || 0) + (item.quantity || 1),
                }
                : i
            ),
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => set(() => ({ items: [] })),
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        console.log("Cart store rehydrated:", state);
      },
    }
  )
);