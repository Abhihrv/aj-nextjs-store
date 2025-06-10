import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => {
          return {
            items: state.items
              .map((item) =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
              )
              .filter((item) => item.quantity > 0),
          };
        }),

      toggleShippingProtection: () => {
        set((state) => {
          const protectionId = "shipping_protection";
          const existing = state.items.find((item) => item.id === protectionId);
          if (existing) {
            return {
              items: state.items.filter((item) => item.id !== protectionId),
            }
          }
          return {
            items: [
              ...state.items,
              {
                id: protectionId,
                name: "Shipping Protection",
                imageUrl: "https://stripe-camo.global.ssl.fastly.net/36a895e90a3bb40ed92d536391ab7a7804a84e23481e6f88ea06cc733aefb7a7/68747470733a2f2f66696c65732e7374726970652e636f6d2f6c696e6b732f4d44423859574e6a64463878556c644a55334e4352316f3151544e7a646b4a5866475a735833526c633352664e566f774d56686d4d6a5a7065556854554552586354466154484a705a6d4656303047764971486d7575/6d65726368616e745f69643d616363745f31525749537342475a3541337376425726636c69656e743d50524f445543545f415049",
                price: 215, // USD
                quantity: 1,
              },
            ],
          }
        })
      },
      clearCart: () =>
        set(() => {
          return { items: [] };
        }),
    }),
    { name: "cart" }
  )
);