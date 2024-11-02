// Remove unused imports
import React, { useState, useEffect } from 'react';
import axiosInstance from "../modules/axiosInstance";

const Root = () => {
    const [message, setMessage] = useState('message not yet loaded...');

    useEffect(() => {
        const fetchMessage = async () => {
          console.log("Trying to access the server...");
          try {
            const res = await axiosInstance.get("data");
            console.log(res.data);
            setMessage(res.data.name);
          } catch (err) {
            console.error("Error fetching message: ", err);
          }
        }
    
        fetchMessage();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Current Users:
            </h2>
            <p className="text-2xl font-semibold text-gray-700">
              {message}
            </p>
          </div>
        </div>
    );
}

export default Root;
