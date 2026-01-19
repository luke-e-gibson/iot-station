import { Outlet, Link, useNavigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';

function Navigation() {
  const { isAuthenticated, user, logout, isHydrated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav>
      <div className="nav-left">
        <Link to="/">Home</Link>
        {isHydrated && isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
        <Link to="/about">About</Link>
      </div>
      <div className="nav-right">
        {!isHydrated ? (
          // Render nothing during SSR/hydration to avoid mismatch
          <></>
        ) : isAuthenticated ? (
          <>
            <span className="user-name">{user?.username}</span>
            <button onClick={handleLogout} className="btn btn-link">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="app">
      <header>
        <Navigation />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
