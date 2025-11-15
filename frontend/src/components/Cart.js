import React, { useState, useEffect } from 'react';
import { cartAPI } from '../services/api';

const Cart = ({ user, onClose }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (err) {
      setError('Failed to fetch cart');
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (sweetId, newQuantity) => {
    try {
      await cartAPI.updateCart(sweetId, newQuantity);
      await fetchCart();
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Update quantity error:', err);
    }
  };

  const handleRemoveItem = async (sweetId) => {
    try {
      await cartAPI.removeFromCart(sweetId);
      await fetchCart();
    } catch (err) {
      setError('Failed to remove item');
      console.error('Remove item error:', err);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      await cartAPI.checkout();
      alert('Checkout successful!');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div className="text-xl">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none rounded-3xl"></div>
          <div className="relative p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-h2 font-bold text-white">Shopping Cart</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-2xl bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 backdrop-blur-md border border-red-400/50 text-red-300 px-4 py-3 rounded-2xl mb-6 text-center text-small">
                {error}
              </div>
            )}

            {!cart || cart.items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                  <span className="text-3xl">🛒</span>
                </div>
                <h4 className="text-h3 font-bold text-white mb-2">Your cart is empty</h4>
                <p className="text-body text-white/70">Add some delicious sweets to get started!</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{item.sweet.name}</h4>
                        <p className="text-small text-white/70">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleUpdateQuantity(item.sweet._id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            className="px-3 py-2 text-white font-bold hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={item.sweet.quantity + item.quantity}
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              handleUpdateQuantity(item.sweet._id, Math.max(1, Math.min(item.sweet.quantity + item.quantity, value)));
                            }}
                            className="w-12 px-2 py-2 bg-transparent text-white text-center font-medium focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(item.sweet._id, Math.min(item.sweet.quantity + item.quantity, item.quantity + 1))}
                            disabled={item.quantity >= (item.sweet.quantity + item.quantity)}
                            className="px-3 py-2 text-white font-bold hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.sweet._id)}
                          className="px-3 py-2 bg-red-500/80 backdrop-blur-md text-white rounded-xl font-medium hover:bg-red-500 border border-red-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-transparent"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/20 pt-6">
                  <div className="flex justify-between items-center text-h2 font-bold text-white mb-6">
                    <span>Total:</span>
                    <span className="text-primary">${cart.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCheckout}
                      disabled={checkoutLoading || cart.totalPrice <= 0}
                      className="flex-1 bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                    >
                      {checkoutLoading ? 'Processing...' : 'Complete Purchase'}
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 bg-white/20 backdrop-blur-md text-white font-semibold py-3 px-6 rounded-2xl border border-white/30 shadow-lg hover:bg-white/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
