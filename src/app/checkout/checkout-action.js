"use server";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export const checkoutAction = async (formData) => {
  const itemsJson = formData.get("items");
  const shippingProtectionJson = formData.get("shippingProtection");
  const items = JSON.parse(itemsJson);
  const shippingProtection = JSON.parse(shippingProtectionJson);
  const taxesJson = formData.get("taxes");
  const shippingJson = formData.get("shipping");
  const taxes = JSON.parse(taxesJson);
  const shipping = JSON.parse(shippingJson);
  
  // Create line items for cart products
  const line_items = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.name },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  // Add shipping protection as a line item if enabled
  if (shippingProtection) {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Shipping Protection" },
        unit_amount: 215, // $2.15 in cents
      },
      quantity: 1,
    });
  }

  // Add shipping fee as a line item if not free
  if (shipping > 0) {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Shipping" },
        unit_amount: shipping,
      },
      quantity: 1,
    });
  }

  // Add tax as a line item
  if (taxes > 0) {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Taxes" },
        unit_amount: taxes,
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  redirect(session.url);
};