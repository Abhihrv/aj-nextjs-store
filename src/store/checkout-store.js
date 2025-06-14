import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const defaultAddress = {
  firstName: "",
  lastName: "",
  email: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
};

const initialState = {
  cartItems: [],
  shippingProtection: false,
  shippingAddress: { ...defaultAddress },
  billingAddress: { ...defaultAddress },
  useBillingAsShipping: true,
  subtotal: 0,
  shippingProtectionFee: 0,
  taxes: 0,
  shipping: 0,
  total: 0,
  isShippingValidCache: false,
  isBillingValidCache: false,
};

export const useCheckoutStore = create()(
  persist(
    (set) => ({
      ...initialState,

      setCartItems: (items) => set(() => ({ cartItems: items })),

      setShippingProtection: (value) => set(() => ({ shippingProtection: value })),

      toggleShippingProtection: () =>
        set((state) => ({ shippingProtection: !state.shippingProtection })),

      updateShippingAddress: (address) =>
        set((state) => ({
          shippingAddress: { ...state.shippingAddress, ...address },
        })),

      updateBillingAddress: (address) =>
        set((state) => ({
          billingAddress: { ...state.billingAddress, ...address },
        })),
        
      setUseBillingAsShipping: (value) =>
        set(() => ({ useBillingAsShipping: value })),

      clearCheckout: () =>
        set(() => ({
          ...initialState,
        })),

      isShippingAddressValid: () =>
        set((state) => {
          const a = state.shippingAddress;
          const valid =
            a.firstName?.trim() &&
            a.lastName?.trim() &&
            a.email?.trim() &&
            a.address1?.trim() &&
            a.city?.trim() &&
            a.state?.trim() &&
            a.zipCode?.trim();

          return { isShippingValidCache: !!valid };
        }),

      isBillingAddressValid: () =>
        set((state) => {
          const a = state.useBillingAsShipping
            ? state.shippingAddress
            : state.billingAddress;

          const valid =
            a.firstName?.trim() &&
            a.lastName?.trim() &&
            a.email?.trim() &&
            a.address1?.trim() &&
            a.city?.trim() &&
            a.state?.trim() &&
            a.zipCode?.trim();

          return { isBillingValidCache: !!valid };
        }),

      calculateCheckoutTotals: () =>
        set((state) => {
          const subtotal = state.cartItems.reduce(
            (total, item) => total + (item.price || 0) * (item.quantity || 0),
            0
          );

          const shippingProtectionFee = state.shippingProtection ? 215 : 0;
          const taxes = Math.round(subtotal * 0.08);
          const shipping = subtotal >= 10000 ? 0 : 1000;
          const total = subtotal + taxes + shipping + shippingProtectionFee;

          return {
            subtotal,
            shippingProtectionFee,
            taxes,
            shipping,
            total,
          };
        }),
    }),
    {
      name: "checkout",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        isShippingValidCache: false,
        isBillingValidCache: false,
      }),
    }
  )
);
