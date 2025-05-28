import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderStore } from '../store/orderStore';
import { useSocket } from '../context/SocketContext';

const OrderList = ({ view = 'kitchen' }) => {
  const orders = useOrderStore(state => state.getAllOrders());
  const { socket } = useSocket();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    if (socket) {
      socket.emit('update_order', { orderId, status: newStatus });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusActions = (order) => {
    switch (order.status) {
      case 'new':
        return (
          <button 
            onClick={() => updateOrderStatus(order.id, 'preparing')}
            className="btn-primary text-sm py-1"
          >
            Start Preparing
          </button>
        );
      case 'preparing':
        return (
          <button 
            onClick={() => updateOrderStatus(order.id, 'ready')}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded-md transition-colors duration-200 text-sm"
          >
            Mark Ready
          </button>
        );
      case 'ready':
        return view === 'kitchen' ? (
          <button 
            onClick={() => updateOrderStatus(order.id, 'delivered')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-1 px-3 rounded-md transition-colors duration-200 text-sm"
          >
            Mark Delivered
          </button>
        ) : null;
      default:
        return null;
    }
  };

  const filteredOrders = view === 'kitchen' 
    ? orders.filter(order => order.status !== 'delivered')
    : orders;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="section-title">
        {view === 'kitchen' ? 'Kitchen Orders' : 'All Orders'}
      </h2>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredOrders.map(order => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`order-item ${order.status === 'new' ? 'order-new' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">Table #{order.tableNumber}</h3>
                    <p className="text-gray-600 text-sm">Order #{order.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600">Customer: {order.customerName}</p>
                  <p className="text-sm text-gray-600">
                    Time: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                <div className="mb-3">
                  <button 
                    onClick={() => toggleOrderExpand(order.id)}
                    className="text-primary-600 text-sm flex items-center"
                  >
                    {expandedOrderId === order.id ? 'Hide Items' : 'Show Items'} 
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ml-1 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <AnimatePresence>
                    {expandedOrderId === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2"
                      >
                        <ul className="text-sm text-gray-700 space-y-1">
                          {order.items.map(item => (
                            <li key={item.id} className="flex justify-between">
                              <span>{item.quantity}× {item.name}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between font-medium">
                          <span>Total:</span>
                          <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex justify-end">
                  {getStatusActions(order)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default OrderList;
