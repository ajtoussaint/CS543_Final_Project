import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../modules/axiosInstance';
import { useUser } from './UserContext';

const Login = () => {
    const nav = useNavigate();
    const { setUser } = useUser();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username) {
            setMessage("Please enter a username");
        } else if (!password) {
            setMessage("Please enter a password")
        } else {
            //call the login route
            try {
                const res = await axiosInstance.post("login", {
                    username: username,
                    password: password
                });

                //for debugging
                console.log(res.data);

                //If the backend sends back a custom error just show that
                if (res.data.error) {
                    //example: incorrect cridentials
                    setMessage(res.data.error)
                } else {
                    //update the user context
                    setUser(res.data.user);
                    //sends newly logged in user to the home page
                    nav("/");
                }
            } catch (err) {
                console.error('Error logging in user: ', err);
                setMessage("Error connecting to server, refresh and try again");
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Login</h2>

                    {/* Username Input */}
                    <div className="mb-4 w-full">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-6 w-full">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-600 active:bg-blue-700 transition duration-200 ease-in-out w-full mb-4"
                    >
                        Login
                    </button>

                    {/* Signup Link */}
                    <p>No Account? </p>
                    <Link
                        to="/signup"
                        className=""
                    >
                        <span className="underline text-blue-500 hover:text-blue-600 transition duration-200 ease-in-out">Create one!</span>
                    </Link>

                    {/* Error Message */}
                    <div className="mt-4 text-red-500 text-center">
                        {message}
                    </div>
                </form>
            </div>
        </div>
    );

}

export default Login