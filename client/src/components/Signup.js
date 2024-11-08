import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../modules/axiosInstance';
import { useUser } from './UserContext';

const Signup = () => {
    const nav = useNavigate();
    const { setUser } = useUser();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [check ,setCheck] = useState([false,false,false,false,false])
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

    const handleSubmit = async (e) =>{
        e.preventDefault();

        //make sure they have a username
        if(!username){
            setMessage("Must have a username")
        }else if(!check.every(Boolean)){
        //check password validity
            setMessage("Passwords must meet all criteria")
        }else{
        //if everything is good send the info to the backend to sign them up
            try{
                const res = await axiosInstance.post("signup", {
                    username:username,
                    password:password
                });

                //If the backend sends back a custom error just show that
                if(res.data.error){
                    setMessage(res.data.error)
                }else{
                    //login the new user
                    console.log("Success: ", res.data)
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
                            //update the user context
                            setUser(res.data.user);
                            //sends newly logged in user to the home page
                            nav("/");
                        }
                    }catch (err){
                        console.error('Error logging in user: ', err);
                        setMessage("Error connecting to server, refresh and try again");
                        nav("/login");
                    }
                }
            }catch (err){
                console.error('Error signing up user: ', err);
                setMessage("Error connecting to server, refresh and try again");
            }
        }
    }

    return (
        <div className="flex items-center justify-center">
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
                <div>
                    <h2 className='text-2xl font-bold mb-4'>
                        Confirm Pasword: 
                    </h2>
                    <input
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </div>
                <button 
                    type="submit"
                    //I typed "nice tailwind button on chatGPT"
                    className = "bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 active:bg-blue-700 transition duration-200 ease-in-out m-2"
                >
                    Signup
                </button>
                <div>
                    <ul>
                        <li>
                            {check[0] ? "OK" : "FIX!" } Password must contain at least 1 uppercase letter
                        </li>
                        <li>
                            {check[1] ? "OK" : "FIX!"} Password must contain at least 1 lowercase letter
                        </li>
                        <li>
                            {check[2] ? "OK" : "FIX!"} Password must contain at least 1 special character !@#$%^&*()
                        </li>
                        <li>
                            {check[3] ? "OK" : "FIX!"} Password must be at least 8 characters in length
                        </li>
                        <li>
                            {check[4] ? "OK" : "FIX!"} Passwords must match
                        </li>
                    </ul>
                </div>
                <div className='m-4 text-red-500'>
                    {message}
                </div>
            </form>
            
        </div>
    )
}

export default Signup