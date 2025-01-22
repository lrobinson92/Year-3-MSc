import React, { useEffect, useState } from "react";
import SideNavbar from '../components/SideNavbar';
import { Navigate } from 'react-router-dom';

const ViewTeams = ( {isAuthenticated }) => {

    if (!isAuthenticated) {
        return <Navigate to='/login' />
    }

    return (
        <div>
            {/* Sidebar and Main Content */}
            <div className="d-flex">
                <SideNavbar />
                <div className="main-content" style={{ padding: '1rem', flex: 1 }}>
                    <div>
                        <h2>Teams</h2>
                        
                    </div>
                    <h2>View Teams</h2>
                    
                </div>
            </div>
        </div>
    );
};


export default ViewTeams;
