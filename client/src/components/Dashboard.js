import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';


const DashboardNav = () => {
    
    const {isLoggedIn, setIsLoggedIn, handleLogout} = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        <div>
            <button className="auth-button" onClick={handleLogout}>Logout</button>
            // display name of the user

        </div>
    );
};

export default DashboardNav;