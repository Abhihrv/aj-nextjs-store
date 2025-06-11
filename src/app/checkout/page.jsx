"use client";
import { useCartStore } from "../../store/cart-store";
import { useCheckoutStore } from "../../store/checkout-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { checkoutAction } from "./checkout-action";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { items, removeItem, addItem, toggleShippingProtection, clearCart } = useCartStore();
  const {
    cartItems,
    shippingAddress,
    billingAddress,
    useBillingAsShipping,
    setCartItems,
    updateShippingAddress,
    updateBillingAddress,
    setUseBillingAsShipping,
    getSubtotal,
    getTax,
    getShipping,
    getTotal,
    isShippingAddressValid,
    isBillingAddressValid,
  } = useCheckoutStore();

  // Sync cart items with checkout store
  useEffect(() => {
    setCartItems(items);
  }, [items, setCartItems]);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingProtectionAdded = items.some(
    (item) => item.id === "shipping_protection"
  );

  const onAddItem = (item) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity: 1,
    });
  };

  const onRemoveItem = (item) => {
    removeItem(item.id);
  };

  if (total === 0 || items.length === 0) {
    return (
      <div>
        <h1>You Cart is Empty.</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* Checkout Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="mb-0.5">First Name</Label>
                  <Input
                    id="firstName"
                    value={shippingAddress.firstName}
                    onChange={(e) => updateShippingAddress({ firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="mb-0.5">Last Name</Label>
                  <Input
                    id="lastName"
                    value={shippingAddress.lastName}
                    onChange={(e) => updateShippingAddress({ lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="mb-0.5">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingAddress.email}
                  onChange={(e) => updateShippingAddress({ email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="mb-0.5">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => updateShippingAddress({ phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <Label htmlFor="address1" className="mb-0.5">Address</Label>
                <Input
                  id="address1"
                  value={shippingAddress.address1}
                  onChange={(e) => updateShippingAddress({ address1: e.target.value })}
                  placeholder="123 Main St"
                />
              </div>
              
              <div>
                <Label htmlFor="address2" className="mb-0.5">Apartment, suite, etc. (Optional)</Label>
                <Input
                  id="address2"
                  value={shippingAddress.address2}
                  onChange={(e) => updateShippingAddress({ address2: e.target.value })}
                  placeholder="Apt 4B"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="mb-0.5">City</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => updateShippingAddress({ city: e.target.value })}
                    placeholder="New York"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="state" className="mb-0.5">State</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => updateShippingAddress({ state: e.target.value })}
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="mb-0.5">ZIP</Label>
                    <Input
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) => updateShippingAddress({ zipCode: e.target.value })}
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="country" className="mb-0.5">Country</Label>
                <Select
                  value={shippingAddress.country}
                  onValueChange={(value) => updateShippingAddress({ country: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-white opacity-100">
                    <SelectItem value="US" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">United States</SelectItem>
                    <SelectItem value="CA" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Canada</SelectItem>
                    <SelectItem value="GB" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">United Kingdom</SelectItem>
                    <SelectItem value="AU" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Australia</SelectItem>
                    <SelectItem value="DE" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Germany</SelectItem>
                    <SelectItem value="FR" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">France</SelectItem>
                    <SelectItem value="IT" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Italy</SelectItem>
                    <SelectItem value="ES" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Spain</SelectItem>
                    <SelectItem value="NL" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Netherlands</SelectItem>
                    <SelectItem value="JP" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Japan</SelectItem>
                    <SelectItem value="MX" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Mexico</SelectItem>
                    <SelectItem value="BR" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Brazil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useBillingAsShipping"
                  checked={useBillingAsShipping}
                  onCheckedChange={(checked) => setUseBillingAsShipping(checked)}
                />
                <Label htmlFor="useBillingAsShipping" className="mb-0.5">
                  Use shipping address for billing
                </Label>
              </div>
              
              {!useBillingAsShipping && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billingFirstName" className="mb-0.5">First Name</Label>
                      <Input
                        id="billingFirstName"
                        value={billingAddress.firstName}
                        onChange={(e) => updateBillingAddress({ firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingLastName" className="mb-0.5">Last Name</Label>
                      <Input
                        id="billingLastName"
                        value={billingAddress.lastName}
                        onChange={(e) => updateBillingAddress({ lastName: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="billingEmail" className="mb-0.5">Email</Label>
                    <Input
                      id="billingEmail"
                      type="email"
                      value={billingAddress.email}
                      onChange={(e) => updateBillingAddress({ email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="billingAddress1" className="mb-0.5">Address</Label>
                    <Input
                      id="billingAddress1"
                      value={billingAddress.address1}
                      onChange={(e) => updateBillingAddress({ address1: e.target.value })}
                      placeholder="123 Main St"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="billingAddress2" className="mb-0.5">Apartment, suite, etc. (Optional)</Label>
                    <Input
                      id="billingAddress2"
                      value={billingAddress.address2}
                      onChange={(e) => updateBillingAddress({ address2: e.target.value })}
                      placeholder="Apt 4B"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billingCity" className="mb-0.5">City</Label>
                      <Input
                        id="billingCity"
                        value={billingAddress.city}
                        onChange={(e) => updateBillingAddress({ city: e.target.value })}
                        placeholder="New York"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="billingState" className="mb-0.5">State</Label>
                        <Input
                          id="billingState"
                          value={billingAddress.state}
                          onChange={(e) => updateBillingAddress({ state: e.target.value })}
                          placeholder="NY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingZipCode" className="mb-0.5">ZIP</Label>
                        <Input
                          id="billingZipCode"
                          value={billingAddress.zipCode}
                          onChange={(e) => updateBillingAddress({ zipCode: e.target.value })}
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="billingCountry" className="mb-0.5">Country</Label>
                    <Select
                      value={billingAddress.country}
                      onValueChange={(value) => updateBillingAddress({ country: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-white opacity-100">
                        <SelectItem value="US" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">United States</SelectItem>
                        <SelectItem value="CA" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Canada</SelectItem>
                        <SelectItem value="GB" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">United Kingdom</SelectItem>
                        <SelectItem value="AU" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Australia</SelectItem>
                        <SelectItem value="DE" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Germany</SelectItem>
                        <SelectItem value="FR" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">France</SelectItem>
                        <SelectItem value="IT" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Italy</SelectItem>
                        <SelectItem value="ES" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Spain</SelectItem>
                        <SelectItem value="NL" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Netherlands</SelectItem>
                        <SelectItem value="JP" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Japan</SelectItem>
                        <SelectItem value="MX" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Mexico</SelectItem>
                        <SelectItem value="BR" className="hover:bg-black hover:text-white focus:bg-black focus:text-white">Brazil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex flex-col gap-2 border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span className="font-semibold">
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        –
                      </Button>
                      <span className="text-lg font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addItem({ ...item, quantity: 1 })}
                      >
                        +
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${(getSubtotal() / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{getShipping() === 0 ? 'Free' : `$${(getShipping() / 100).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${(getTax() / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>${(getTotal() / 100).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button type="button" onClick={() => toggleShippingProtection()} className="w-full">
              {shippingProtectionAdded ? "Remove" : "Add"} Shipping Protection ($2.15)
            </Button>

            <form action={checkoutAction} className="space-y-4">
              <input type="hidden" name="items" value={JSON.stringify(items)} />
              <input type="hidden" name="shippingAddress" value={JSON.stringify(shippingAddress)} />
              <input type="hidden" name="billingAddress" value={JSON.stringify(useBillingAsShipping ? shippingAddress : billingAddress)} />
              
              <Button
                type="submit"
                variant="default"
                className="w-full bg-black hover:bg-gray-800 text-white hover:text-white cursor-pointer"
                disabled={!isShippingAddressValid() || !isBillingAddressValid()}
              >
                Proceed to Payment
              </Button>
            </form>

            <Button
              onClick={() => clearCart()}
              variant="outline"
              className="w-full"
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
