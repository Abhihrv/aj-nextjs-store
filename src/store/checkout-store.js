import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCheckoutStore = create()(
  persist(
    (set, get) => ({
      // Cart items from cart store
      cartItems: [],
      
      // Shipping address
      shippingAddress: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "US",
      },
      
      // Billing address (can be same as shipping)
      billingAddress: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "US",
      },
      
      // Checkout state
      useBillingAsShipping: true,
      
      // Actions
      setCartItems: (items) =>
        set(() => ({
          cartItems: items,
        })),
      
      updateShippingAddress: (address) =>
        set((state) => ({
          shippingAddress: { ...state.shippingAddress, ...address },
        })),
      
      updateBillingAddress: (address) =>
        set((state) => ({
          billingAddress: { ...state.billingAddress, ...address },
        })),
      
      setUseBillingAsShipping: (value) =>
        set(() => ({
          useBillingAsShipping: value,
        })),
      
      // Helper to get effective billing address
      getEffectiveBillingAddress: () => {
        const state = get();
        return state.useBillingAsShipping 
          ? state.shippingAddress 
          : state.billingAddress;
      },
      
      // Calculate totals
      getSubtotal: () => {
        const state = get();
        return state.cartItems.reduce(
          (total, item) => total + (item.price * item.quantity), 0
        );
      },
      
      getTax: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * 0.08); // 8% tax rate
      },
      
      getShipping: () => {
        const state = get();
        // Free shipping over $100, otherwise $10
        const subtotal = state.getSubtotal();
        return subtotal >= 10000 ? 0 : 1000; // $100 in cents
      },
      
      getTotal: () => {
        const state = get();
        return state.getSubtotal() + state.getTax() + state.getShipping();
      },
      
      // Validation
      isShippingAddressValid: () => {
        const { shippingAddress } = get();
        return (
          shippingAddress.firstName.trim() &&
          shippingAddress.lastName.trim() &&
          shippingAddress.email.trim() &&
          shippingAddress.address1.trim() &&
          shippingAddress.city.trim() &&
          shippingAddress.state.trim() &&
          shippingAddress.zipCode.trim()
        );
      },
      
      isBillingAddressValid: () => {
        const state = get();
        if (state.useBillingAsShipping) {
          return state.isShippingAddressValid();
        }
        
        const { billingAddress } = state;
        return (
          billingAddress.firstName.trim() &&
          billingAddress.lastName.trim() &&
          billingAddress.email.trim() &&
          billingAddress.address1.trim() &&
          billingAddress.city.trim() &&
          billingAddress.state.trim() &&
          billingAddress.zipCode.trim()
        );
      },
      
      // Clear checkout data
      clearCheckout: () =>
        set(() => ({
          cartItems: [],
          shippingAddress: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zipCode: "",
            country: "US",
          },
          billingAddress: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zipCode: "",
            country: "US",
          },
          useBillingAsShipping: true,
        })),
    }),
    { name: "checkout" }
  )
); 