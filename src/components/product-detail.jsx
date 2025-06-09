"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export const ProductDetail = ({ product }) => {
  const { items, addItem, removeItem } = useCartStore();
  const price = product.default_price;
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const onAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: price.unit_amount,
      imageUrl: product.images ? product.images[0] : null,
      quantity: 1,
    }); 
  };

  const onRemoveItem = () => {
    removeItem(product.id);
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-center">
      {product.images && product.images[0] && (
        <div className="relative h-96 w-full md:w-1/2 rounded-lg overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="transition duration-300 object-contain hover:opacity-90"
            priority
          />
        </div>
      )}
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        {product.description && (
          <p className="text-gray-700 mb-4">{product.description}</p>
        )}
        {price && price.unit_amount && (
          <p className="text-lg font-semibold text-gray-900">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
            }).format(price.unit_amount / 100)}
          </p>
        )}
        <div className="flex items-center space-x-4">
          <Button
            className="cursor-pointer hover:bg-gray-100"
            variant="outline"
            size="icon"
            onClick={onRemoveItem}
          >
            <MinusIcon className="w-4 h-4" />
          </Button>
          <span className="text-lg font-semibold">{quantity}</span>
          <Button
            className="cursor-pointer bg-black hover:bg-gray-800 text-white hover:text-white"
            variant="outline"
            size="icon"
            onClick={onAddItem}
          >
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
