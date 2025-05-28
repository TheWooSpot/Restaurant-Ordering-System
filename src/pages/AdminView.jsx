import { motion } from 'framer-motion';
import OrderStats from '../components/OrderStats';
import OrderList from '../components/OrderList';

const AdminView = () => {
  return (
    <div>
      <motion.section 
        className="bg-gray-800 text-white py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-300">Monitor restaurant performance and order history</p>
        </div>
      </motion.section>
      
      <OrderStats />
      
      <OrderList view="admin" />
    </div>
  );
};

export default AdminView;
