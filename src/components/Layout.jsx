import { Outlet, NavLink } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';

const Layout = () => {
  const cartItemCount = useOrderStore(state => state.getCartItemCount());

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8c0 4.5-2.5 8-7 8s-7-3.5-7-8 2.5-8 7-8 7 3.5 7 8Z"/>
              <path d="M17 8h4v1a4 4 0 0 1-4 4h-1"/>
              <path d="M13 15.5V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3"/>
            </svg>
            <h1 className="ml-2 text-2xl font-display font-bold text-gray-800">Gourmet Hub</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? "text-primary-600 font-medium" : "text-gray-600 hover:text-primary-600"
              }
              end
            >
              Menu
            </NavLink>
            <NavLink 
              to="/kitchen" 
              className={({ isActive }) => 
                isActive ? "text-primary-600 font-medium" : "text-gray-600 hover:text-primary-600"
              }
            >
              Kitchen
            </NavLink>
            <NavLink 
              to="/admin" 
              className={({ isActive }) => 
                isActive ? "text-primary-600 font-medium" : "text-gray-600 hover:text-primary-600"
              }
            >
              Admin
            </NavLink>
          </nav>
          
          <div className="flex items-center">
            <NavLink to="/" className="relative p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Gourmet Hub</h3>
              <p className="text-gray-300">Delicious food, delivered fast.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Hours</h3>
              <p className="text-gray-300">Monday - Friday: 11am - 10pm</p>
              <p className="text-gray-300">Saturday - Sunday: 10am - 11pm</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">123 Food Street, Tasty City</p>
              <p className="text-gray-300">Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Gourmet Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
