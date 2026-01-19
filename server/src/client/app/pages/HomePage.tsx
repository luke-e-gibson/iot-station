import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, isHydrated } = useAuth();

  return (
    <div className="page home-page">
      <h1>Welcome to Weather Station</h1>
      <p>Monitor your weather data in real-time.</p>
      
      {isHydrated && (
        <div className="home-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
