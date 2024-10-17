import React from 'react';
import {Link} from "react-router-dom";

const Subpage2 = () => {
    return(
        <div>
            <div>This is subpage 2!</div>
            <Link to='/otherPage'>Go to Subpage 1</Link>
        </div>
    )
}

export default Subpage2;