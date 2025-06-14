import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body || !Array.isArray(body.line_items) || !body.order_total || !body.customer_details || !body.shipping_details || !body.billing_details) {
      console.error("Invalid order data:", body);
      return NextResponse.json({ 
        error: "Invalid order data", 
        details: "Missing required fields: line_items, order_total, customer_details, shipping_details, or billing_details" 
      }, { status: 400 });
    }

    const docRef = await adminDb.collection("orders").add({
      ...body,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id }, { status: 200 });
  } catch (err) {
    console.error("🔥 Firestore insert error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
