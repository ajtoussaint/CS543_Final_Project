import React, { useEffect, useState } from 'react';
import { Link, Outlet } from "react-router-dom";
import axiosInstance from '../modules/axiosInstance';

const Header = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
              const res = await axiosInstance.get("user");
              setUser(res.data);
            } catch (err) {
              console.error("Error fetching user data:", err);
            }
          };
          
          fetchUser();
    }, []);

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
        <div>
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
            <Outlet />
        </div>
    )
}

export default Header;