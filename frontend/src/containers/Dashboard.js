import React from 'react';
import { Navigate } from 'react-router-dom';
import SideNavbar from '../components/SideNavbar';


const Dashboard = ( {isAuthenticated }) => {


    /*if (!isAuthenticated) {
        return <Navigate to='/' />
    }
        */

    return (
        <div>
            {/* Sidebar and Main Content */}
            <div className="d-flex">
                <SideNavbar />
                <div className="main-content" style={{ flex: 1, padding: '2rem' }}>
                    <div
                        style={{
                            width: '100%',
                            margin: '0 auto',
                            background: '#F2F2F7',
                            borderRadius: 30,
                            padding: '2rem',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            marginTop: '4rem',
                        }}
                    >
                        {/* Recent Items */}
                        <div className="row mb-4">
                            <h3>Recent Items</h3>
                            <div className="col-md-4 mb-3">
                                <div className="card p-3">
                                    <h5>Item 1</h5>
                                    <p>Details about recent item 1.</p>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card p-3">
                                    <h5>Item 2</h5>
                                    <p>Details about recent item 2.</p>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card p-3">
                                    <h5>Item 3</h5>
                                    <p>Details about recent item 3.</p>
                                </div>
                            </div>
                        </div>
    
                        {/* Tasks */}
                        <div className="row mb-4">
                            <h3>Tasks</h3>
                            <div className="col-md-4 mb-3">
                                <div className="card p-3">
                                    <h5>Task 1</h5>
                                    <p>Details about task 1.</p>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card p-3">
                                    <h5>Task 2</h5>
                                    <p>Details about task 2.</p>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card p-3">
                                    <h5>Task 3</h5>
                                    <p>Details about task 3.</p>
                                </div>
                            </div>
                        </div>
    
                        {/* Teams */}
                        <div className="row">
                            <h3>Teams</h3>
                            <div className="col-md-4 mb-3">
                                <div className="card p-3">
                                    <h5>Team 1</h5>
                                    <p>Details about team 1.</p>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card p-3">
                                    <h5>Team 2</h5>
                                    <p>Details about team 2.</p>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card p-3">
                                    <h5>Team 3</h5>
                                    <p>Details about team 3.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
};


export default Dashboard;