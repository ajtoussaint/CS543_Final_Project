import React from 'react';
import {Link} from "react-router-dom";

const Subpage1 = () => {
    return(
        <div>
            <div>This is subpage 1!</div>
            <Link to='/otherPage/2'>Go to Subpage 2</Link>
        </div>
        
    )
}

export default Subpage1;