//A unified context for determining whether the user is logged in in every component

//not suitable for authentication, to authenticate GET request to /user
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../modules/axiosInstance';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser(){
      setLoading(true);
      const { data } = await axiosInstance.get("/user");
      console.log("Context fetched user: " , data);
      setUser(data);
      setLoading(false);
    }

    fetchUser();
  },[]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
