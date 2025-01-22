import React from 'react';
import SideNavbar from '../components/SideNavbar';
import { Navigate } from 'react-router-dom';

const ViewTasks = ( {isAuthenticated }) => {




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
                        <h2>Tasks</h2>
                        
                    </div>
                    <h2>Create a Task</h2>
                    
                </div>
            </div>
        </div>
    );
};

export default ViewTasks;
