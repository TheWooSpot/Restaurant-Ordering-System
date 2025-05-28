import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderStore } from '../store/orderStore';
import { useSocket } from '../context/SocketContext';

const Cart = () => {
  const { cart, removeFromCart, addToCart, clearCart, placeOrder, getCartTotal, tableNumber, setTableNumber, customerName, setCustomerName } = useOrderStore();
  const { socket } = useSocket();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!tableNumber || !customerName || cart.length === 0) return;
    
    setIsSubmitting(true);
    
    const order = placeOrder(socket);
    if (order) {
      setOrderNumber(order.id.substring(0, 8).toUpperCase());
      setOrderPlaced(true);
    }
    
    setIsSubmitting(false);
  };

  const handleNewOrder = () => {
    setOrderPlaced(false);
    setOrderNumber(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Your Order</h2>
      
      <AnimatePresence>
        {orderPlaced ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Placed!</h3>
            <p className="text-gray-600 mb-4">Your order #{orderNumber} has been received and is being prepared.</p>
            <button 
              onClick={handleNewOrder}
              className="btn-primary"
            >
              Place New Order
            </button>
          </motion.div>
        ) : (
          <>
            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-2">Add some delicious items from the menu</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="max-h-64 overflow-y-auto mb-4">
                  <AnimatePresence>
                    {cart.map(item => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-between items-center py-3 border-b"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-500 text-sm">${item.price.toFixed(2)} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-gray-500 hover:text-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="p-1 text-gray-500 hover:text-green-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-t border-dashed">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">${getCartTotal().toFixed(2)}</span>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-3">
                    <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Table Number
                    </label>
                    <input
                      type="text"
                      id="tableNumber"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="input-field"
                      placeholder="Enter table number"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="input-field"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={clearCart}
                      className="btn-outline flex-1"
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                      disabled={isSubmitting || cart.length === 0}
                    >
                      {isSubmitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
