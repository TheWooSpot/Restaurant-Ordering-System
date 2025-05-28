import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMenuStore } from '../store/menuStore';
import { useOrderStore } from '../store/orderStore';

const MenuList = () => {
  const { categories, selectedCategory, setSelectedCategory, getFilteredMenuItems } = useMenuStore();
  const addToCart = useOrderStore(state => state.addToCart);
  const [animatingItems, setAnimatingItems] = useState({});

  const menuItems = getFilteredMenuItems();

  const handleAddToCart = (item) => {
    // Set animating state for this item
    setAnimatingItems(prev => ({ ...prev, [item.id]: true }));
    
    // Add to cart
    addToCart(item);
    
    // Reset animation after a delay
    setTimeout(() => {
      setAnimatingItems(prev => ({ ...prev, [item.id]: false }));
    }, 500);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="section-title">Our Menu</h2>
      
      {/* Category Filter */}
      <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <button
          className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${
            selectedCategory === 'all' 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${
              selectedCategory === category 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Menu Items */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {menuItems.map(item => (
          <motion.div 
            key={item.id} 
            className="food-item"
            variants={item}
            whileHover={{ scale: 1.03 }}
          >
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-48 object-cover"
              />
              {item.popular && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Popular
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <span className="font-bold text-primary-600">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">{item.prepTime} min</span>
                <motion.button
                  className="btn-primary"
                  onClick={() => handleAddToCart(item)}
                  whileTap={{ scale: 0.95 }}
                  animate={animatingItems[item.id] ? { 
                    scale: [1, 1.2, 1],
                    transition: { duration: 0.3 }
                  } : {}}
                >
                  Add to Order
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {menuItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default MenuList;
