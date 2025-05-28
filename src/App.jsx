import { Routes, Route } from 'react-router-dom';
import CustomerView from './pages/CustomerView';
import KitchenView from './pages/KitchenView';
import AdminView from './pages/AdminView';
import Layout from './components/Layout';
import { useEffect } from 'react';
import { useSocket } from './context/SocketContext';
import { useOrderStore } from './store/orderStore';
import { useMenuStore } from './store/menuStore';

function App() {
  const { socket } = useSocket();
  const { addOrder, updateOrder } = useOrderStore();
  const { setMenuItems } = useMenuStore();

  useEffect(() => {
    // Fetch menu items
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
      })
      .catch(err => console.error('Error fetching menu:', err));

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
