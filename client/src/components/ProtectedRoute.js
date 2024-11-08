import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import axiosInstance from '../modules/axiosInstance';
import Loading from "./Loading";

//wraps routes that require auth
const ProtectedRoute = ({ children }) => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchUser(){
      try{
        const { data } = await axiosInstance.get("/user");
        console.log("Protector fetched user: " , data);
        setUser(data);
      }catch(err){
        console.error(err);
        nav("/login");
      }finally{
        setLoading(false);
      }
    }

    fetchUser();


  }, [setUser, nav]);

   if (loading) {
    return <Loading />; 
  }

  return user ? children : null; // Render children if user is signed in
};

export default ProtectedRoute;
