import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory data storage
const menuItems = [
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
  },
  {
    id: '6',
    name: 'Veggie Wrap',
    description: 'Grilled vegetables, hummus, and feta cheese in a spinach wrap',
    price: 10.99,
    category: 'sandwiches',
    image: 'https://images.pexels.com/photos/1352270/pexels-photo-1352270.jpeg',
    prepTime: 12,
    popular: false
  },
  {
    id: '7',
    name: 'Chicken Alfredo',
    description: 'Fettuccine pasta with creamy Alfredo sauce and grilled chicken',
    price: 15.99,
    category: 'pasta',
    image: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg',
    prepTime: 18,
    popular: false
  },
  {
    id: '8',
    name: 'Mushroom Risotto',
    description: 'Creamy Arborio rice with wild mushrooms and Parmesan',
    price: 13.99,
    category: 'mains',
    image: 'https://images.pexels.com/photos/5638527/pexels-photo-5638527.jpeg',
    prepTime: 22,
    popular: false
  },
  {
    id: '9',
    name: 'BBQ Ribs',
    description: 'Slow-cooked pork ribs with house BBQ sauce and coleslaw',
    price: 19.99,
    category: 'mains',
    image: 'https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg',
    prepTime: 30,
    popular: false
  },
  {
    id: '10',
    name: 'Mango Smoothie',
    description: 'Fresh mango blended with yogurt and honey',
    price: 5.99,
    category: 'drinks',
    image: 'https://images.pexels.com/photos/1346063/pexels-photo-1346063.jpeg',
    prepTime: 5,
    popular: false
  },
  {
    id: '11',
    name: 'Garlic Bread',
    description: 'Toasted baguette with garlic butter and herbs',
    price: 4.99,
    category: 'sides',
    image: 'https://images.pexels.com/photos/1252841/pexels-photo-1252841.jpeg',
    prepTime: 8,
    popular: false
  },
  {
    id: '12',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
    price: 8.99,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/6133305/pexels-photo-6133305.jpeg',
    prepTime: 10,
    popular: false
  }
];

const orders = [];

// Middleware
app.use(express.json());

// API routes
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data to the client
  socket.emit('menu_updated', menuItems);
  socket.emit('orders_updated', orders);
  
  // Handle new order
  socket.on('place_order', (order) => {
    console.log('New order received:', order);
    orders.unshift(order);
    io.emit('new_order', order);
  });
  
  // Handle order status update
  socket.on('update_order', ({ orderId, status }) => {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      io.emit('order_updated', orders[orderIndex]);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
