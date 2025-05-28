import { motion } from 'framer-motion';
import MenuList from '../components/MenuList';
import Cart from '../components/Cart';
import FeaturedItems from '../components/FeaturedItems';

const CustomerView = () => {
  return (
    <div>
      {/* Hero Section */}
      <motion.section 
        className="relative bg-gray-900 text-white py-16 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg" 
            alt="Restaurant background" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.h1 
              className="text-4xl md:text-5xl font-display font-bold mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Delicious Food, <br />Delivered Fast
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Browse our menu, place your order, and watch as your food is prepared in real-time.
            </motion.p>
            <motion.a 
              href="#menu"
              className="btn-primary text-lg px-6 py-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Menu
            </motion.a>
          </div>
        </div>
      </motion.section>
      
      {/* Featured Items */}
      <FeaturedItems />
      
      {/* Main Content */}
      <section id="menu" className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MenuList />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Cart />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerView;
