import { motion } from 'framer-motion';
import OrderList from '../components/OrderList';

const KitchenView = () => {
  return (
    <div>
      <motion.section 
        className="bg-gray-800 text-white py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Kitchen Dashboard</h1>
          <p className="text-gray-300">Manage and track orders in real-time</p>
        </div>
      </motion.section>
      
      <OrderList view="kitchen" />
    </div>
  );
};

export default KitchenView;
