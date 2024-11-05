import React, { useEffect } from 'react';
import { Link, Outlet } from "react-router-dom";
import axiosInstance from '../modules/axiosInstance';
import { useUser } from './UserContext';

const Header = () => {
    const { user, setUser } = useUser();

    //this effect might not do anything
    useEffect(() => {
        const fetchUser = async () => {
            try {
              const res = await axiosInstance.get("user");
              setUser(res.data);
            } catch (err) {
              if(err.status === 401){
                console.log("User is not signed in");
              }else{
                console.error("Error fetching user data:", err);
              }
              
            }
          };
          
          fetchUser();
    }, [setUser]);

    const logout = async (e) => {
        e.preventDefault();
        console.log("Logout button clicked");
        try{
            const res = await axiosInstance.get("logout");
            if(!res.error){
                console.log("logged out");
                setUser(null);
            }else{
                console.error("Error from server logging out: ", res.error);
            }
        }catch (err){
            console.error("Error logging out: ", err);
        }
    }

    return(
        <div className='h-10vh'>
            <div className='flex space-x-4'>
                {user ? (
                    <div>
                        <div>
                            {user.username}
                        </div>
                        <button onClick={logout}>
                            Logout
                        </button>
                    </div>
                ): (
                    <Link to='/login'>
                        Not logged in
                    </Link>
                )}
                <Link to='/create'>
                    Create a Question    
                </Link>
            </div>            
            <Outlet />
        </div>
    )
}

export default Header;