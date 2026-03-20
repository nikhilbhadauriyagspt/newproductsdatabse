import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CartDrawer from './components/CartDrawer';
import SearchOverlay from './components/SearchOverlay';
import BottomNav from './components/BottomNav';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ReturnPolicy from './pages/ReturnPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import FAQ from './pages/FAQ';
import Profile from './pages/Profile';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManager from './pages/admin/ProductManager';
import ProductForm from './pages/admin/ProductForm';
import BulkProductUpload from './pages/admin/BulkProductUpload';
import CategoryManager from './pages/admin/CategoryManager';
import OrderManager from './pages/admin/OrderManager';
import ContactManager from './pages/admin/ContactManager';
import NewsletterManager from './pages/admin/NewsletterManager';
import UserManager from './pages/admin/UserManager';

// Layout wrapper for customer-facing pages
const ShopLayout = ({ children }) => (
  <div className="bg-white min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow ">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  const paypalOptions = {
    "client-id": "Aa7mAnBKh44YCdokTrFjIP1wIB6mVVjrN8z-NZc_G2VLYJle_Xz9pMdOO7DRXx7zYT7Gh0dzbJUY9DDm",
    currency: "USD",
    intent: "capture"
  };

  return (
    <CartProvider>
      <PayPalScriptProvider options={paypalOptions}>
        <Router>
          <ScrollToTop />
          <Toast />
          <CartDrawer />
          <SearchOverlay />
          <BottomNav />
          <Routes>        {/* Customer Routes */}
            <Route path="/" element={<ShopLayout><Home /></ShopLayout>} />
            <Route path="/shop" element={<ShopLayout><Shop /></ShopLayout>} />
            <Route path="/category/:category" element={<ShopLayout><Shop /></ShopLayout>} />
            <Route path="/brand/:brand" element={<ShopLayout><Shop /></ShopLayout>} />
            <Route path="/product/:slug" element={<ShopLayout><ProductDetail /></ShopLayout>} />
            <Route path="/about" element={<ShopLayout><About /></ShopLayout>} />
            <Route path="/contact" element={<ShopLayout><Contact /></ShopLayout>} />
            <Route path="/cart" element={<ShopLayout><Cart /></ShopLayout>} />
            <Route path="/wishlist" element={<ShopLayout><Wishlist /></ShopLayout>} />
            <Route path="/checkout" element={<ShopLayout><Checkout /></ShopLayout>} />
            <Route path="/orders" element={<ShopLayout><Orders /></ShopLayout>} />
            <Route path="/track-order" element={<ShopLayout><Orders /></ShopLayout>} />
            <Route path="/faq" element={<ShopLayout><FAQ /></ShopLayout>} />
            <Route path="/profile" element={<ShopLayout><Profile /></ShopLayout>} />
            <Route path="/privacy-policy" element={<ShopLayout><PrivacyPolicy /></ShopLayout>} />
            <Route path="/cookie-policy" element={<ShopLayout><CookiePolicy /></ShopLayout>} />
            <Route path="/terms-and-conditions" element={<ShopLayout><TermsAndConditions /></ShopLayout>} />
            <Route path="/return-policy" element={<ShopLayout><ReturnPolicy /></ShopLayout>} />
            <Route path="/shipping-policy" element={<ShopLayout><ShippingPolicy /></ShopLayout>} />
            <Route path="/login" element={<ShopLayout><UserLogin /></ShopLayout>} />
            <Route path="/signup" element={<ShopLayout><UserSignup /></ShopLayout>} />

            {/* Admin Auth */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="products/add" element={<ProductForm />} />
              <Route path="products/bulk" element={<BulkProductUpload />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="contacts" element={<ContactManager />} />
              <Route path="newsletter" element={<NewsletterManager />} />
              <Route path="users" element={<UserManager />} />
              <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
            </Route>
          </Routes>
        </Router>
      </PayPalScriptProvider>
    </CartProvider>
  );
} export default App;
