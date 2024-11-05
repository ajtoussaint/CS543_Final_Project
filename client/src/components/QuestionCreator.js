import React, { useEffect } from "react";
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const QuestionCreator = () => {
    const { user } = useUser();
    const nav = useNavigate();
    
    useEffect(() =>{
        if(!user){
            //if not logged in send the user to the login page
            nav("/login");
        }
    }, [])

    if (!user) return null;

    return (
        <div>
            create a q page.
        </div>
    )
}

export default QuestionCreator;