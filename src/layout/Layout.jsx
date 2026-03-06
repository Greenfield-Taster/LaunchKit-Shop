import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Перейти до контенту
      </a>
      <Header />
      <main className="main" id="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
