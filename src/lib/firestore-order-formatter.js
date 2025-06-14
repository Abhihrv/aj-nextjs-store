export function formatOrderForFirestore({
    cartItems,
    shippingAddress,
    billingAddress,
    useBillingAsShipping,
    subtotal,
    taxes,
    shipping: shipping_total,
    shippingProtection,
    total: order_total,
}) {
    const createdAt = new Date().toISOString();

    const shippingDetails = {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        street_address1: shippingAddress.address1,
        street_address2: shippingAddress.address2,
        city: shippingAddress.city,
        province: shippingAddress.state,
        zip: shippingAddress.zipCode,
        country_code: shippingAddress.country || "US",
    };

    const billingDetails = useBillingAsShipping
        ? { ...shippingDetails }
        : {
            first_name: billingAddress.firstName,
            last_name: billingAddress.lastName,
            street_address1: billingAddress.address1,
            street_address2: billingAddress.address2,
            city: billingAddress.city,
            province: billingAddress.state,
            zip: billingAddress.zipCode,
            country_code: billingAddress.country || "US",
        };

    const customer = {
        first_name: billingDetails.first_name,
        last_name: billingDetails.last_name,
        email: billingDetails.email || "no email",
    };

    const lineItems = cartItems.map((item, index) => ({
        shipping_method: "Standard",
        sku: item.sku || String(index + 1),
        product_id: item.id,
        line_id: String(index + 1),
        name: item.name,
        upc: item.upc || "0000",
        quantity: item.quantity,
        price: item.price / 100, // cents → dollars
        image_url: item.imageUrl || "",
    }));

    return {
        order_id: crypto.randomUUID().slice(0, 8),
        created_on: createdAt,
        updated_on: createdAt,
        currency: "USD",
        order_total: order_total / 100,
        subtotal: subtotal / 100,
        taxes: taxes / 100,
        discounts_total: 0,
        shipping_total: shipping_total / 100,
        insurance_selected: shippingProtection,
        shipping_details: shippingDetails,
        billing_details: billingDetails,
        customer_details: customer,
        line_items: lineItems,
    };
}