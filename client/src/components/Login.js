import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../modules/axiosInstance';

const Login = () => {
    const nav = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!username){
            setMessage("Please enter a username");
        }else if(!password){
            setMessage("Please enter a password")
        }else{
            //call the login route
            try{
                const res = await axiosInstance.post("login", {
                    username:username,
                    password:password
                });

                //for debugging
                console.log(res.data);

                //If the backend sends back a custom error just show that
                if(res.data.error){
                    //example: incorrect cridentials
                    setMessage(res.data.error)
                }else{
                    //sends newly logged in user to the home page
                    nav("/");
                }
            }catch (err){
                console.error('Error logging in user: ', err);
                setMessage("Error connecting to server, refresh and try again");
            }
        }
    }

    return (
        <div className='flex items-center justify-center'>
            <form onSubmit={handleSubmit} className='flex items-center flex-col justify-center bg-gray-100 p-4'>
                <div>
                    <h2 className='text-2xl font-bold mb-4'>
                        Username: 
                    </h2>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <h2 className='text-2xl font-bold mb-4'>
                        Password: 
                    </h2>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button 
                    type="submit"
                    //I typed "nice tailwind button on chatGPT"
                    className = "bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 active:bg-blue-700 transition duration-200 ease-in-out m-2"
                >
                    Login
                </button>
                <Link to='/signup'>
                    No Account? Create one!
                </Link>
                <div className='m-4 text-red-500'>
                    {message}
                </div>
            </form>
        </div>
    )
}

export default Login