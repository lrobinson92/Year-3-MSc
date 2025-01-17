import React from 'react';
import { Navigate } from 'react-router-dom';
import SideNavbar from '../components/SideNavbar';


const ViewSOP = ( {isAuthenticated }) => {


    /*if (!isAuthenticated) {
        return <Navigate to='/' />
    }
        */

    return (
        <div>
            {/* Sidebar and Main Content */}
            <div className="d-flex">
                <SideNavbar />
                <div className="main-content" style={{ padding: '1rem', flex: 1 }}>
                    <h1>View SOP</h1>
                    <p>Your main content goes here...</p>
                </div>
            </div>
        </div>
    );
};


export default ViewSOP;