import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  Lock,
  MapPin,
  Mail,
  Loader2,
  Navigation,
  CheckCircle2,
  Package,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PayPalButtons } from "@paypal/react-paypal-js";
import API_BASE_URL from '../config';

export default function Checkout() {
  const { cart, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalTotal = total;

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'cod',
  });

  const [detectingLocation, setDetectingLocation] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();

          if (data.address) {
            const addr = data.address;
            const streetAddress = [
              addr.house_number,
              addr.road,
              addr.suburb,
              addr.neighbourhood,
            ]
              .filter(Boolean)
              .join(', ');

            setFormData((prev) => ({
              ...prev,
              address: streetAddress || data.display_name,
              city: addr.city || addr.town || addr.village || addr.state || '',
              zipCode: addr.postcode || '',
            }));
          }
        } catch (err) {
          console.error("Location detection error:", err);
          alert("Could not detect address. Please enter it manually.");
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDetectingLocation(false);
        alert("Location access denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSuccess = async (paymentDetails = null) => {
    setLoading(true);
    try {
      const orderData = {
        ...formData,
        address: formData.address,
        user_id: user?.id,
        total: finalTotal,
        items: cart,
        payment_details: paymentDetails,
        origin: window.location.origin, // Dynamic origin tracking
        notes: `Order from ${window.location.hostname}`,
      };

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setOrderId(data.order_id);
        setStep(4); // Final success step
        clearCart();
      } else {
        alert('Error placing order: ' + data.message);
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (formData.paymentMethod === 'cod') {
      await handleOrderSuccess();
    }
  };

  const getItemImage = (item) => {
    try {
      const images =
        typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
      if (Array.isArray(images) && images.length > 0) {
        const first = images[0];
        return String(first).startsWith('/') ? first : `/${first}`;
      }
    } catch { }
    return '/logo/fabicon.png';
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white font-sans text-center">
        <div className="w-16 h-16 bg-slate-50 border border-slate-200 flex items-center justify-center mb-6 rounded-full text-slate-400">
          <Package size={30} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Shopping Cart is empty.</h2>
        <p className="text-slate-600 mb-8 max-w-md text-sm">
          Please add products to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="h-10 px-8 bg-[#f7ca00] border border-[#f2c200] text-slate-900 inline-flex items-center justify-center text-sm font-medium rounded-lg hover:bg-[#f3bb00] transition-all shadow-sm"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white font-sans text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-green-50 text-green-600 flex items-center justify-center mb-6 border border-green-100 rounded-full"
        >
          <CheckCircle2 size={40} />
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Thank you, your order has been placed.
        </h1>
        <p className="text-slate-600 text-sm mb-8 max-w-[560px]">
          An email confirmation has been sent to <strong>{formData.email}</strong>.
        </p>

        <div className="bg-slate-50 border border-slate-200 p-6 mb-8 max-w-md w-full rounded-xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Order Confirmation
          </p>
          <p className="text-2xl font-black text-slate-900">
            #ORD-{orderId || '000-0000'}
          </p>
        </div>

        <Link
          to="/"
          className="h-11 px-10 bg-[#f7ca00] border border-[#f2c200] text-slate-900 inline-flex items-center justify-center text-sm font-bold rounded-lg hover:bg-[#f3bb00] transition-all"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* AMAZON STYLE MINIMAL HEADER */}
      <div className="bg-white border-b border-slate-200 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="shrink-0">
             <img src="/logo/logo.png" className="h-8 md:h-10 object-contain" alt="Logo" />
          </Link>
          <h1 className="text-xl md:text-2xl font-medium text-slate-700">Checkout</h1>
          <Lock className="text-slate-400" size={20} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT CONTENT: STEPS */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* STEP 1: SHIPPING ADDRESS */}
            <div className={`bg-white border ${step === 1 ? 'border-orange-400 shadow-md ring-1 ring-orange-200' : 'border-slate-200'} rounded-lg overflow-hidden`}>
              <div className={`p-4 flex justify-between items-center ${step > 1 ? 'bg-slate-50 cursor-pointer' : ''}`} onClick={() => step > 1 && setStep(1)}>
                <div className="flex gap-4">
                  <span className={`text-lg font-bold ${step === 1 ? 'text-orange-600' : 'text-slate-500'}`}>1</span>
                  <div>
                    <h3 className="text-lg font-bold">Shipping address</h3>
                    {step > 1 && (
                      <div className="text-sm text-slate-600 mt-1">
                        {formData.firstName} {formData.lastName}, {formData.address}, {formData.city}, {formData.zipCode}
                      </div>
                    )}
                  </div>
                </div>
                {step > 1 && <span className="text-sm text-blue-600 font-medium hover:underline">Change</span>}
              </div>
              
              {step === 1 && (
                <div className="p-6 border-t border-slate-100">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <button
                      type="button"
                      onClick={detectLocation}
                      disabled={detectingLocation}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 transition-all border border-slate-200 disabled:opacity-50"
                    >
                      {detectingLocation ? <Loader2 className="animate-spin" size={14} /> : <Navigation size={14} />}
                      {detectingLocation ? 'LOCATING...' : 'AUTO DETECT MY LOCATION'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">First name</label>
                      <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full h-10 px-3 border border-slate-400 rounded-md shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">Last name</label>
                      <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full h-10 px-3 border border-slate-400 rounded-md shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <label className="text-sm font-bold text-slate-700">Street address</label>
                    <input required name="address" value={formData.address} onChange={handleInputChange} placeholder="Street address, P.O. box, company name, c/o" className="w-full h-10 px-3 border border-slate-400 rounded-md shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">City</label>
                      <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full h-10 px-3 border border-slate-400 rounded-md shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">ZIP / Postal Code</label>
                      <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full h-10 px-3 border border-slate-400 rounded-md shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <label className="text-sm font-bold text-slate-700">Phone number</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full h-10 px-3 border border-slate-400 rounded-md shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm" />
                    <p className="text-[11px] text-slate-500">May be used to assist delivery</p>
                  </div>

                  <div className="mt-4 space-y-1">
                    <label className="text-sm font-bold text-slate-700">Email address</label>
                    <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full h-10 px-3 border border-slate-400 rounded-md shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm" />
                    <p className="text-[11px] text-slate-500">For order confirmation and updates</p>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="mt-6 w-full md:w-auto px-10 h-10 bg-[#ffd814] border border-[#fcd200] text-slate-900 text-sm font-medium rounded-lg hover:bg-[#f7ca00] transition-all shadow-sm"
                  >
                    Use this address
                  </button>
                </div>
              )}
            </div>

            {/* STEP 2: PAYMENT METHOD */}
            <div className={`bg-white border ${step === 2 ? 'border-orange-400 shadow-md ring-1 ring-orange-200' : 'border-slate-200'} rounded-lg overflow-hidden`}>
              <div className={`p-4 flex justify-between items-center ${step > 2 ? 'bg-slate-50 cursor-pointer' : ''}`} onClick={() => step > 2 && setStep(2)}>
                <div className="flex gap-4">
                  <span className={`text-lg font-bold ${step === 2 ? 'text-orange-600' : 'text-slate-500'}`}>2</span>
                  <div>
                    <h3 className="text-lg font-bold">Payment method</h3>
                    {step > 2 && (
                      <div className="text-sm text-slate-600 mt-1">
                        {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'PayPal'}
                      </div>
                    )}
                  </div>
                </div>
                {step > 2 && <span className="text-sm text-blue-600 font-medium hover:underline">Change</span>}
              </div>

              {step === 2 && (
                <div className="p-6 border-t border-slate-100">
                  <div className="space-y-4">
                    <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                      <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="mt-1" />
                      <div>
                        <span className="text-sm font-bold block">Cash on Delivery (COD)</span>
                        <span className="text-xs text-slate-600">Pay cash upon delivery. Safe and reliable.</span>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                      <input type="radio" name="paymentMethod" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleInputChange} className="mt-1" />
                      <div>
                        <span className="text-sm font-bold block">PayPal</span>
                        <span className="text-xs text-slate-600">Pay via PayPal or Credit/Debit Card.</span>
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    className="mt-6 w-full md:w-auto px-10 h-10 bg-[#ffd814] border border-[#fcd200] text-slate-900 text-sm font-medium rounded-lg hover:bg-[#f7ca00] transition-all shadow-sm"
                  >
                    Use this payment method
                  </button>
                </div>
              )}
            </div>

            {/* STEP 3: REVIEW ITEMS AND SHIPPING */}
            <div className={`bg-white border ${step === 3 ? 'border-orange-400 shadow-md ring-1 ring-orange-200' : 'border-slate-200'} rounded-lg overflow-hidden`}>
              <div className="p-4 flex gap-4">
                <span className={`text-lg font-bold ${step === 3 ? 'text-orange-600' : 'text-slate-500'}`}>3</span>
                <h3 className="text-lg font-bold">Review items and shipping</h3>
              </div>

              {step === 3 && (
                <div className="p-6 border-t border-slate-100">
                  <div className="border border-slate-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                      <Truck size={18} />
                      <span>Arriving in 3-5 business days</span>
                    </div>

                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                          <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded flex items-center justify-center p-2 shrink-0">
                            <img src={getItemImage(item)} className="max-w-full max-h-full object-contain" alt={item.name} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{item.name}</h4>
                            <p className="text-xs font-bold text-slate-700 mt-1">${item.price.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-1">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {formData.paymentMethod === 'paypal' ? (
                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <PayPalButtons
                        style={{ layout: "vertical", shape: "rect", height: 50 }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: { value: finalTotal.toString() },
                                description: `Printer Shop Order - ${cartCount} item(s)`,
                              },
                            ],
                          });
                        }}
                        onApprove={async (data, actions) => {
                          const details = await actions.order.capture();
                          await handleOrderSuccess(details);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center gap-4">
                       <button
                        onClick={() => handleOrderSuccess()}
                        disabled={loading}
                        className="w-full md:w-auto px-10 h-12 bg-[#ffd814] border border-[#fcd200] text-slate-900 text-sm font-bold rounded-lg hover:bg-[#f7ca00] transition-all shadow-md"
                      >
                        {loading ? 'Processing...' : 'Place your order'}
                      </button>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-red-700">Order Total: ${finalTotal.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500">By placing your order, you agree to our privacy notice and conditions of use.</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SUMMARY: STICKY BOX */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5 sticky top-24 shadow-sm">
              {step < 3 && (formData.paymentMethod === 'cod' || step === 1) && (
                <button
                  onClick={step === 1 ? () => setStep(2) : () => setStep(3)}
                  className="w-full h-10 bg-[#ffd814] border border-[#fcd200] text-slate-900 text-sm font-medium rounded-lg hover:bg-[#f7ca00] transition-all shadow-sm mb-4"
                >
                  {step === 1 ? 'Use this address' : 'Use this payment method'}
                </button>
              )}

              {step === 3 && formData.paymentMethod === 'cod' && (
                 <button
                  onClick={() => handleOrderSuccess()}
                  disabled={loading}
                  className="w-full h-10 bg-[#ffd814] border border-[#fcd200] text-slate-900 text-sm font-bold rounded-lg hover:bg-[#f7ca00] transition-all shadow-sm mb-4"
                >
                  {loading ? 'Processing...' : 'Place your order'}
                </button>
              )}

              <p className="text-[11px] text-slate-500 text-center mb-5 leading-tight">
                By placing your order, you agree to our <span className="text-blue-600 hover:underline cursor-pointer">privacy notice</span> and <span className="text-blue-600 hover:underline cursor-pointer">conditions of use</span>.
              </p>

              <div className="border-t border-slate-200 pt-4 space-y-3">
                <h3 className="text-base font-bold text-slate-900 mb-2">Order Summary</h3>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Items:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Shipping & handling:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700 pb-3 border-b border-slate-100">
                  <span>Total before tax:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-red-700 pt-1">
                  <span>Order Total:</span>
                  <span>${finalTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-3">
                 <div className="flex gap-2 items-center text-[11px] text-blue-600 font-bold hover:underline cursor-pointer mb-2">
                    <span>How are shipping costs calculated?</span>
                 </div>
                 <div className="flex gap-2 items-center text-[11px] text-blue-600 font-bold hover:underline cursor-pointer">
                    <span>Why didn't my coupon work?</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}