import React from 'react';
import { Link, Outlet } from "react-router-dom";

const Header = () => {
    return(
        <div>
            <Link to='/login'>Logged in as: </Link>
            <Outlet />
        </div>
    )
}

export default Header;