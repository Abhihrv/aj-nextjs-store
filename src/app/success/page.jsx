"use client";

import Link from "next/link";
import { useEffect, useCallback } from "react";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import { formatOrderForFirestore } from "@/lib/firestore-order-formatter";

export default function SuccessPage() {
  const { clearCart, items: cartItems } = useCartStore.getState();
  const {
    shippingAddress,
    billingAddress,
    useBillingAsShipping,
    subtotal,
    taxes,
    shipping,
    shippingProtection,
    total,
    clearCheckout,
  } = useCheckoutStore.getState();

  // Mock order reference and delivery date
  const orderReference = "991PKV1J435S";
  const deliveryDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  })();

  const sendOrderToFirestore = useCallback(async () => {
    try {
      const orderData = formatOrderForFirestore({
        cartItems,
        shippingAddress,
        billingAddress,
        useBillingAsShipping,
        subtotal,
        taxes,
        shipping,
        shippingProtection,
        total,
      });

      console.log("Sending order:", orderData);

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      console.log("✅ Order saved with ID:", data.id);
      return true;
    } catch (err) {
      console.error("❌ Order submission failed:", err.message);
      return false;
    }
  }, []);

  useEffect(() => {
    async function finalize() {
      const success = await sendOrderToFirestore();
      if (success) {
        clearCart();
        clearCheckout();
      }
    }
    finalize();
  }, [sendOrderToFirestore, clearCart, clearCheckout]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-lg bg-white rounded-md shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold tracking-wide mb-1">THANK YOU FOR YOUR ORDER</h2>
          <p className="text-sm text-gray-500 mb-2">Please check your inbox, as a confirmation email is on its way.</p>
          <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-700 mt-4">
            <div className="font-medium">ORDER TOTAL:</div>
            <div className="text-right font-semibold">${((total || 0) / 100).toFixed(2)}</div>
            <div className="font-medium">ORDER REFERENCE:</div>
            <div className="text-right">{orderReference}</div>
            <div className="font-medium">DELIVERY:</div>
            <div className="text-right">Delivered on or before {deliveryDate}</div>
            <div className="font-medium">ORDER STATUS:</div>
            <div className="text-right">Received</div>
          </div>
        </div>

        {/* Items */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold mb-3 tracking-wide">{cartItems.length} ITEM{cartItems.length > 1 ? 'S' : ''}</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 items-center mb-4 last:mb-0">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded border border-gray-200" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">${((item.price || 0) / 100).toFixed(2)}</span>
                  <span className="text-xs text-gray-500 font-medium">{item.size ? ` ${item.size}` : ''}</span>
                </div>
                <div className="text-sm font-medium truncate">{item.name}</div>
                <div className="text-xs text-gray-500 truncate">{item.color ? <span className="font-semibold text-black">{item.color}</span> : null}</div>
                <div className="text-xs text-gray-500">Qty: <span className="font-semibold text-black">{item.quantity}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Links */}
        <div className="px-6 py-3 border-b border-gray-100 text-sm text-gray-700">
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-1 md:space-y-0">
            <Link href="#" className="hover:underline">Cancel this order</Link>
            <Link href="#" className="hover:underline">My Account</Link>
            <Link href="#" className="hover:underline">Returns Policy</Link>
          </div>
        </div>

        {/* Packaging Info */}
        <div className="px-6 py-3 flex items-center gap-2 text-xs text-gray-500">
          <span className="inline-block">♻️</span>
          <span>Our plastic bags and cardboard boxes are 100% recyclable</span>
        </div>

        {/* Continue Shopping Button */}
        <div className="px-6 py-5">
          <Link
            href="/products"
            className="block w-full text-center bg-black text-white font-bold py-3 rounded hover:bg-gray-900 tracking-wide text-base"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
}
