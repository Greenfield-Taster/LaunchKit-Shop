import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, WishlistProvider, CartProvider } from "./contexts";
import Layout from "./layout/Layout";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import ScrollToTop from "./utils/ScrollToTop";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";

import "./styles/main.scss";

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider currency="₴">
          <Router>
            <ScrollToTop />
            <Layout>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </Layout>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
