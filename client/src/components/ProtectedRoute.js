import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

//wraps routes that require auth
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {

    if (!loading) {
      if (!user) {
        //console.log("kicked out: ", user, loading);
        //navigate('/login');
      } else {
        //console.log("let in: ", user, loading);
      }
    }

  }, [user, loading, navigate]);

   if (loading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return user ? children : null; // Render children if user is signed in
};

export default ProtectedRoute;
