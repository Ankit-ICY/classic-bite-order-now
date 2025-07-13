import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, CreditCard, Smartphone, CheckCircle, Clock } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  group: 'food' | 'drink' | 'dessert';
  isVeg: boolean;
  image: string;
}

interface OrderForm {
  customerName: string;
  tableNumber: string;
  specialRequirements: string;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, items } = location.state as { cart: Record<string, number>, items: FoodItem[] };

  const [orderForm, setOrderForm] = useState<OrderForm>({
    customerName: '',
    tableNumber: '',
    specialRequirements: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | ''>('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = Object.entries(cart).map(([itemId, quantity]) => ({
    item: items.find(item => item.id === itemId)!,
    quantity
  }));

  const subtotal = cartItems.reduce((total, { item, quantity }) => total + (item.price * quantity), 0);
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + tax;

  const updateCart = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      const newCart = { ...cart };
      delete newCart[itemId];
      navigate('/checkout', { 
        state: { cart: newCart, items }, 
        replace: true 
      });
    } else {
      navigate('/checkout', { 
        state: { cart: { ...cart, [itemId]: newQuantity }, items }, 
        replace: true 
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!orderForm.customerName || !paymentMethod) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setOrderPlaced(true);

    // Auto redirect after 5 seconds
    setTimeout(() => {
      navigate('/');
    }, 5000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Order Placed Successfully!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you, {orderForm.customerName}! Your delicious order is being prepared with love.
          </p>
          <div className="bg-primary/10 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-primary mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Estimated Time</span>
            </div>
            <p className="text-2xl font-bold text-primary">15-20 mins</p>
          </div>
          <p className="text-sm text-muted-foreground">
            You'll be redirected to the menu in a few seconds...
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 btn-primary w-full"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Processing Payment...</h2>
          <p className="text-muted-foreground">Please wait while we process your order</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Order Summary */}
        <div className="card-elegant p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>Order Summary</span>
            <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
              {Object.values(cart).reduce((sum, count) => sum + count, 0)} items
            </span>
          </h2>
          
          <div className="space-y-4">
            {cartItems.map(({ item, quantity }) => (
              <div key={item.id} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                {/* Left Content - Mobile optimized */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground">{item.name}</h3>
                    <div className={item.isVeg ? 'indicator-veg' : 'indicator-non-veg'} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="px-2 py-1 bg-secondary/50 text-secondary-foreground text-xs rounded-full">
                      {item.category}
                    </span>
                    <span className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full">
                      {item.group.charAt(0).toUpperCase() + item.group.slice(1)}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-primary">₹{item.price}</p>
                  
                  {/* Cart Controls - Mobile layout */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateCart(item.id, quantity - 1)}
                        className="counter-btn"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold min-w-[2rem] text-center">{quantity}</span>
                      <button
                        onClick={() => updateCart(item.id, quantity + 1)}
                        className="counter-btn"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-bold text-lg">₹{item.price * quantity}</p>
                  </div>
                </div>
                
                {/* Right Image - Fixed positioning */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 self-start">
                  <img 
                    src={typeof item.image === 'string' && item.image.startsWith('/') ? item.image : item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Details */}
        <div className="card-elegant p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={orderForm.customerName}
                onChange={(e) => setOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter your name"
                className="search-input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Table Number <span className="text-sm text-muted-foreground">(Optional)</span>
              </label>
              <input
                type="text"
                value={orderForm.tableNumber}
                onChange={(e) => setOrderForm(prev => ({ ...prev, tableNumber: e.target.value }))}
                placeholder="e.g., T-15, A-3"
                className="search-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Special Requirements
              </label>
              <textarea
                value={orderForm.specialRequirements}
                onChange={(e) => setOrderForm(prev => ({ ...prev, specialRequirements: e.target.value }))}
                placeholder="Any special instructions for your order..."
                rows={3}
                className="search-input resize-none"
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-primary font-medium mb-1">🎉 Thank you for choosing us!</p>
            <p className="text-sm text-muted-foreground">
              Our chefs are excited to prepare your delicious meal with the finest ingredients.
            </p>
          </div>
        </div>

        {/* Payment Section */}
        <div className="card-elegant p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          
          {/* Bill Summary */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3 mb-6">
            <h3 className="font-medium text-foreground">Choose Payment Method</h3>
            
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                paymentMethod === 'upi' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-medium">UPI Payment</div>
                  <div className="text-sm text-muted-foreground">
                    Pay using Google Pay, PhonePe, Paytm, etc.
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                paymentMethod === 'card' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-medium">Card Payment</div>
                  <div className="text-sm text-muted-foreground">
                    Pay using Credit/Debit card
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={!orderForm.customerName || !paymentMethod}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
              !orderForm.customerName || !paymentMethod
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'btn-primary text-primary-foreground hover:scale-105'
            }`}
          >
            Place Order - ₹{total}
          </button>
          
          <p className="text-xs text-muted-foreground text-center mt-3">
            By placing this order, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
}