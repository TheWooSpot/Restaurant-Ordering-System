import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOrderStore } from '../store/orderStore';

const OrderStats = () => {
  const orders = useOrderStore(state => state.getAllOrders());
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    statusCounts: {
      new: 0,
      preparing: 0,
      ready: 0,
      delivered: 0
    }
  });

  useEffect(() => {
    if (orders.length === 0) return;
    
    const statusCounts = {
      new: 0,
      preparing: 0,
      ready: 0,
      delivered: 0
    };
    
    let totalRevenue = 0;
    
    orders.forEach(order => {
      statusCounts[order.status]++;
      totalRevenue += order.totalAmount;
    });
    
    setStats({
      totalOrders: orders.length,
      totalRevenue,
      averageOrderValue: totalRevenue / orders.length,
      statusCounts
    });
  }, [orders]);

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Avg. Order Value',
      value: `$${stats.averageOrderValue.toFixed(2)}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Pending Orders',
      value: stats.statusCounts.new + stats.statusCounts.preparing + stats.statusCounts.ready,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="section-title">Order Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center mb-4">
              {stat.icon}
              <h3 className="ml-3 text-lg font-semibold text-gray-700">{stat.title}</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusCard 
            title="New" 
            count={stats.statusCounts.new} 
            color="bg-yellow-500" 
            percentage={orders.length ? (stats.statusCounts.new / orders.length) * 100 : 0} 
          />
          <StatusCard 
            title="Preparing" 
            count={stats.statusCounts.preparing} 
            color="bg-blue-500" 
            percentage={orders.length ? (stats.statusCounts.preparing / orders.length) * 100 : 0} 
          />
          <StatusCard 
            title="Ready" 
            count={stats.statusCounts.ready} 
            color="bg-green-500" 
            percentage={orders.length ? (stats.statusCounts.ready / orders.length) * 100 : 0} 
          />
          <StatusCard 
            title="Delivered" 
            count={stats.statusCounts.delivered} 
            color="bg-gray-500" 
            percentage={orders.length ? (stats.statusCounts.delivered / orders.length) * 100 : 0} 
          />
        </div>
      </div>
    </div>
  );
};

const StatusCard = ({ title, count, color, percentage }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-gray-700">{title}</h4>
        <span className="text-lg font-semibold">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div 
          className={`h-2.5 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        ></motion.div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of orders</p>
    </div>
  );
};

export default OrderStats;
