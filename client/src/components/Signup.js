import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../modules/axiosInstance';

const Signup = () => {
    const nav = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [check, setCheck] = useState([false, false, false, false, false])
    const [message, setMessage] = useState('');

    //checks passwords any time one is changed
    useEffect(() => {
        //ensure passwords meet criteria
        const checkPasswords = () => {
            let p = password;
            let p2 = password2;

            let arr = [];

            arr.push(/[A-Z]/.test(p));
            arr.push(/[a-z]/.test(p));
            arr.push(/[!@#$%^&*()]/.test(p));
            arr.push(p.length > 7);
            arr.push(p === p2);

            setCheck(arr);
        }
        checkPasswords();
    }, [password, password2]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        //make sure they have a username
        if (!username) {
            setMessage("Must have a username")
        } else if (!check.every(Boolean)) {
            //check password validity
            setMessage("Passwords must meet all criteria")
        } else {
            //if everything is good send the info to the backend to sign them up
            try {
                const res = await axiosInstance.post("signup", {
                    username: username,
                    password: password
                });

                //If the backend sends back a custom error just show that
                if (res.data.error) {
                    setMessage(res.data.error)
                } else {
                    //TODO: login the new user
                    console.log("Success: ", res.data)
                }
            } catch (err) {
                console.error('Error signing up user: ', err);
                setMessage("Error connecting to server, refresh and try again");
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Left Section: Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center justify-center w-1/2 p-6 bg-white"
                >
                    <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
                    <div className="mb-4 w-full">
                        <label className="text-lg font-medium">Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 p-2 w-full border rounded"
                        />
                    </div>
                    <div className="mb-4 w-full">
                        <label className="text-lg font-medium">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 w-full border rounded"
                        />
                    </div>
                    <div className="mb-6 w-full">
                        <label className="text-lg font-medium">Confirm Password:</label>
                        <input
                            type="password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            className="mt-1 p-2 w-full border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 active:bg-blue-700 transition duration-200 ease-in-out"
                    >
                        <Link
                            to="/login"
                            className=""
                        >
                            Signup
                        </Link>
                    </button>
                    <div className="m-4 text-red-500">{message}</div>
                </form>

                {/* Right Section: Password Conditions */}
                <div className="w-1/2 p-6 flex flex-col justify-center bg-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Password Requirements:</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li className={check[0] ? "text-green-500" : "text-red-500"}>
                            {check[0] ? "OK" : "FIX!"} Password must contain at least 1 uppercase letter
                        </li>
                        <li className={check[1] ? "text-green-500" : "text-red-500"}>
                            {check[1] ? "OK" : "FIX!"} Password must contain at least 1 lowercase letter
                        </li>
                        <li className={check[2] ? "text-green-500" : "text-red-500"}>
                            {check[2] ? "OK" : "FIX!"} Password must contain at least 1 special character !@#$%^&*()
                        </li>
                        <li className={check[3] ? "text-green-500" : "text-red-500"}>
                            {check[3] ? "OK" : "FIX!"} Password must be at least 8 characters in length
                        </li>
                        <li className={check[4] ? "text-green-500" : "text-red-500"}>
                            {check[4] ? "OK" : "FIX!"} Passwords must match
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );


}

export default Signup