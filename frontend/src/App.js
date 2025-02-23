import './App.css';
import 'animate.css';
import { Outlet,useLocation  } from 'react-router-dom';
import Header from './components/Header';
import SellerHeader from './components/SellerHeader'; // Import the seller-specific header

import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContextProvider } from './context';
import { UserProvider } from './context/userContext'; // Import the UserProvider
import { CartProvider } from './context/CartContext';
import {SellerProvider} from './context/SellerContext'


function App() {
  const location = useLocation();

  // Check if the current path is part of the seller panel (e.g., /seller)
  const isSellerPanel = location.pathname.includes("seller");
  console.log(process.env.REACT_APP_ACCESS_KEY, process.env.REACT_APP_SECRET_ACCESS_KEY,process.env.REACT_APP_BUCKET_REGION )


  return (
    <ContextProvider>
      <UserProvider>
        <CartProvider>
          <SellerProvider> {/* Wrap SellerProvider here */}
            <ToastContainer position="top-center" />
            {isSellerPanel ? <SellerHeader /> : <Header />}
            <main className="min-h-[calc(100vh-120px)] pt-16">
              <Outlet />
            </main>
            <Footer />
          </SellerProvider>
        </CartProvider>
      </UserProvider>
    </ContextProvider>
  );
}

export default App;
