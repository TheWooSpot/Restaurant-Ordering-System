import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export const useOrderStore = create((set, get) => ({
  orders: [],
  cart: [],
  tableNumber: '',
  customerName: '',

  setTableNumber: (tableNumber) => set({ tableNumber }),
  setCustomerName: (customerName) => set({ customerName }),

  addToCart: (item) => {
    const cart = get().cart;
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      const updatedCart = cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      );
      set({ cart: updatedCart });
    } else {
      set({ cart: [...cart, { ...item, quantity: 1 }] });
    }
  },

  removeFromCart: (itemId) => {
    const cart = get().cart;
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      const updatedCart = cart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      );
      set({ cart: updatedCart });
    } else {
      set({ cart: cart.filter(item => item.id !== itemId) });
    }
  },

  clearCart: () => set({ cart: [] }),

  placeOrder: (socket) => {
    const { cart, tableNumber, customerName } = get();
    
    if (cart.length === 0) return null;
    
    const order = {
      id: uuidv4(),
      items: cart,
      tableNumber,
      customerName,
      status: 'new',
      totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      createdAt: new Date().toISOString(),
    };
    
    if (socket) {
      socket.emit('place_order', order);
      // Add order locally in case socket fails
      set(state => ({ orders: [order, ...state.orders] }));
    } else {
      // If socket is not available, still add the order locally
      set(state => ({ orders: [order, ...state.orders] }));
    }
    
    set({ cart: [], tableNumber: '', customerName: '' });
    return order;
  },

  addOrder: (order) => set(state => ({ 
    orders: [order, ...state.orders.filter(o => o.id !== order.id)] 
  })),

  updateOrder: (updatedOrder) => set(state => ({
    orders: state.orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    )
  })),

  getOrdersByStatus: (status) => {
    return get().orders.filter(order => order.status === status);
  },

  getAllOrders: () => get().orders,

  getCartTotal: () => {
    return get().cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getCartItemCount: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}));
