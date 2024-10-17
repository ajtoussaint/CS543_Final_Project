import React from 'react';
import { Link, Outlet } from "react-router-dom";

const OtherPage = () => {
    return (
        <div>
            <div>You are on the other page!</div>
            <Link to='/'>Go Back</Link>
            <Outlet />
        </div> 
    )
}

export default OtherPage;