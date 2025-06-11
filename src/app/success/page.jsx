"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";

export default function SuccessPage() {
    const { clearCart } = useCartStore();
    const { clearCheckout } = useCheckoutStore();
    
    useEffect(() => {
      clearCart();
      clearCheckout();
    }, [clearCart, clearCheckout]);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="mb-4">
          Thank you for your purchase. Your order is being processed.
        </p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }