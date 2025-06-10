import { stripe } from "@/lib/stripe";
import { ProductList } from "@/components/product-list";

export default async function ProductPage() {
    const stripeProducts = await stripe.products.list({
        expand: ["data.default_price"],
      });
    
    const products = stripeProducts.data.filter((product) => product.id !== "prod_ST5lxHhLtEzVHj")
    return (
        <div>
            <h1>All Products</h1>
            <ProductList products={products} />
        </div>
    )
}