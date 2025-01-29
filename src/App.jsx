import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ProductsAdmin from "./admin/components/Products/Products";
import Footer from "./components/Footer";
import PrivateRoute from "./components/auth/PrivateRoute";
import { AuthProvider } from './components/auth/AuthContext';
import "./App.css";
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div id="root">
          <Navbar />
          <div className="content" style={{ marginTop: "120px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <ProductsAdmin />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
