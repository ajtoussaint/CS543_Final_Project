import React, { useEffect } from 'react';
import { Link, Outlet } from "react-router-dom";
import axiosInstance from '../modules/axiosInstance';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, setUser } = useUser();
    const nav = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("user");
                setUser(res.data);
            } catch (err) {
                if (err.status === 401) {
                    console.log("User is not signed in");
                } else {
                    console.error("Error fetching user data:", err);
                }
            }
        };
        fetchUser();
    }, [setUser]);

    const logout = async (e) => {
        e.preventDefault();
        console.log("Logout button clicked");
        try {
            const res = await axiosInstance.get("logout");
            if (!res.error) {
                console.log("logged out");
                setUser(null);
                nav("/login");
            } else {
                console.error("Error from server logging out: ", res.error);
            }
        } catch (err) {
            console.error("Error logging out: ", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white shadow-md">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <Link to="/" className="text-xl font-bold hover:text-blue-200">
                        QuizMaker
                    </Link>
                    <nav className="flex items-center space-x-4">
                        <Link to="/create" className="hover:text-blue-200">
                            Create a New Question
                        </Link>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="font-medium">{user.username}</span>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded">
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
            </header>
            <main className="container mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default Header;
