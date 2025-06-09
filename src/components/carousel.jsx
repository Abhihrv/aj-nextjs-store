"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardTitle, CardContent } from "./ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Carousel = ({ products }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length]);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const goToPrevious = () => {
    setCurrent(current === 0 ? products.length - 1 : current - 1);
  };

  const goToNext = () => {
    setCurrent((current + 1) % products.length);
  };

  const currentProduct = products[current];
  const price = currentProduct.default_price;

  if (!products.length) return null;

  return (
    <div className="relative group w-full">
      <Card className="relative overflow-hidden rounded-xl shadow-2xl border-0 h-96 md:h-[500px]">
        {/* Background Image */}
        {currentProduct.images && currentProduct.images[0] && (
          <div className="absolute inset-0">
            <Image
              src={currentProduct.images[0]}
              alt={currentProduct.name}
              fill
              className="object-cover transition-all duration-700 ease-in-out transform group-hover:scale-105"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        )}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Previous product"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Next product"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Content */}
        <CardContent className="absolute inset-0 flex flex-col justify-end p-8 z-10">
          <div className="space-y-4">
            <CardTitle className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {currentProduct.name}
            </CardTitle>
            
            {price && price.unit_amount && (
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-white">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 2,
                  }).format(price.unit_amount / 100)}
                </span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Available Now
                </span>
              </div>
            )}

            {currentProduct.description && (
              <p className="text-gray-200 text-lg max-w-2xl line-clamp-2">
                {currentProduct.description}
              </p>
            )}

            <button className="bg-white text-black hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 w-fit">
              Shop Now
            </button>
          </div>
        </CardContent>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${((current + 1) / products.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Dot Indicators */}
      <div className="flex justify-center space-x-3 mt-6">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current 
                ? "bg-gray-600 w-8" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Thumbnail Strip (Optional) */}
      <div className="flex justify-center space-x-2 mt-4 overflow-x-auto pb-2">
        {products.map((product, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              index === current 
                ? "border-gray-500 opacity-100" 
                : "border-transparent opacity-60 hover:opacity-80"
            }`}
          >
            {product.images && product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
