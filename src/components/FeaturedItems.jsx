import { motion } from 'framer-motion';
import { useMenuStore } from '../store/menuStore';
import { useOrderStore } from '../store/orderStore';

const FeaturedItems = () => {
  const popularItems = useMenuStore(state => state.getPopularItems());
  const addToCart = useOrderStore(state => state.addToCart);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">Featured Dishes</h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {popularItems.map((item, index) => (
            <motion.div 
              key={item.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-50"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white font-bold text-lg">{item.name}</h3>
                  <p className="text-white text-opacity-80 text-sm">{item.category}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary-600">${item.price.toFixed(2)}</span>
                  <motion.button
                    className="btn-primary"
                    onClick={() => addToCart(item)}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to Order
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedItems;
