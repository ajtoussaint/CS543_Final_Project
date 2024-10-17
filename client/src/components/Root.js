//default styles and image
import logo from '../logo.svg';
import '../App.css';

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
          }catch (err){
            console.error("Error fetching message: ", err);
          }
        }
    
        fetchMessage();
      }, []);

      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <p>
              If this says the name of the user you inserted in the database then the client, server, and database all connect: {message}
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      );
}

export default Root;