import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { connect } from 'react-redux';
import { checkAuthenticated, load_user } from '../actions/auth';
import axios from 'axios';

const Layout = ({ checkAuthenticated, load_user, children }) => {
    useEffect(() => {
        checkAuthenticated();
        load_user();
        fetchCsrfToken();
    }, [checkAuthenticated, load_user]);

    const fetchCsrfToken = async () => {
        try {
            await axios.get("http://localhost:8000/sop/set-csrf/", { withCredentials: true });
            console.log("CSRF cookie set");
        } catch (error) {
            console.error("Failed to set CSRF cookie:", error);
        }
    };

    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
};

export default connect(null, { checkAuthenticated, load_user })(Layout);

