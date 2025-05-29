import { Routes, Route } from 'react-router-dom';
import CustomerView from './pages/CustomerView';
import KitchenView from './pages/KitchenView';
import AdminView from './pages/AdminView';
import Layout from './components/Layout';
import { useEffect, useState } from 'react';
import { useSocket } from './context/SocketContext';
import { useOrderStore } from './store/orderStore';
import { useMenuStore } from './store/menuStore';

function App() {
  const { socket, connected } = useSocket();
  const { addOrder, updateOrder } = useOrderStore();
  const { setMenuItems } = useMenuStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch menu items
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching menu:', err);
        // Fallback to hardcoded menu if API fails
        const fallbackMenu = [
          {
            id: '1',
            name: 'Classic Burger',
            description: 'Juicy beef patty with lettuce, tomato, and special sauce',
            price: 12.99,
            category: 'burgers',
            image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
            prepTime: 15,
            popular: true
          },
          {
            id: '2',
            name: 'Margherita Pizza',
            description: 'Fresh mozzarella, tomatoes, and basil on a thin crust',
            price: 14.99,
            category: 'pizza',
            image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg',
            prepTime: 20,
            popular: true
          },
          {
            id: '3',
            name: 'Caesar Salad',
            description: 'Crisp romaine lettuce with Caesar dressing and croutons',
            price: 9.99,
            category: 'salads',
            image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
            prepTime: 10,
            popular: false
          },
          {
            id: '4',
            name: 'Grilled Salmon',
            description: 'Fresh salmon fillet with lemon butter sauce and vegetables',
            price: 18.99,
            category: 'mains',
            image: 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg',
            prepTime: 25,
            popular: true
          },
          {
            id: '5',
            name: 'Chocolate Lava Cake',
            description: 'Warm chocolate cake with a molten center and vanilla ice cream',
            price: 7.99,
            category: 'desserts',
            image: 'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg',
            prepTime: 15,
            popular: true
          }
        ];
        setMenuItems(fallbackMenu);
        setIsLoading(false);
      });

    // Socket event listeners
    if (socket) {
      socket.on('new_order', (order) => {
        addOrder(order);
      });

      socket.on('order_updated', (updatedOrder) => {
        updateOrder(updatedOrder);
      });

      socket.on('menu_updated', (menu) => {
        setMenuItems(menu);
      });

      return () => {
        socket.off('new_order');
        socket.off('order_updated');
        socket.off('menu_updated');
      };
    }
  }, [socket, addOrder, updateOrder, setMenuItems]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Gourmet Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CustomerView />} />
        <Route path="kitchen" element={<KitchenView />} />
        <Route path="admin" element={<AdminView />} />
      </Route>
    </Routes>
  );
}

export default App;
