import React from 'react';
import { Link, Outlet } from "react-router-dom";

const OtherPage = () => {
    return (
        <div>
            <div>You are on the other page!</div>
            <Link to='/'>Go Back</Link>
            <h1>Testing media upload:</h1>
        </div> 
    )
}

export default OtherPage;