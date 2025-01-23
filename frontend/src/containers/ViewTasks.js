import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import SideNavbar from '../components/SideNavbar';

const ViewTasks = ( {isAuthenticated, firstLogin }) => {

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (firstLogin) {
        return <Navigate to="/dashboard" />;
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

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    firstLogin: state.auth.firstLogin,
});

export default connect(mapStateToProps)(ViewTasks);
