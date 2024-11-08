//A unified context for determining whether the user is logged in in every component

//not suitable for authentication, to authenticate GET request to /user
import React, { createContext, useState, useContext } from 'react';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
