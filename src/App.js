import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage    from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard    from "./pages/Dashboard";
import LandingPage  from "./pages/LandingPage";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <div style={{fontFamily:'var(--mono)',color:'var(--cyan)',fontSize:13,letterSpacing:'0.1em'}}>
        INITIALIZING...
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/login"     element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register"  element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
