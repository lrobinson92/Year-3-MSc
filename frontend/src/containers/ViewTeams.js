import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar';

const ViewTeams = ( {isAuthenticated, firstLogin }) => {

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
                    <Sidebar />
                    <div className="main-content">
                    <div className="recent-items-card">
                            {/* Recent Items */}
                            <div className="row mb-4">
                                <h3>All Teams</h3>
                                <div className="col-md-4 mb-3">
                                    <div className="card p-3">
                                        <h5>Team 1</h5>
                                        <p>Details about team 1.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="card p-3">
                                        <h5>Team 2</h5>
                                        <p>Details about recent team  2.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="card p-3">
                                        <h5>Team 3</h5>
                                        <p>Details about recent team  3.</p>
                                    </div>
                                </div>       
                                <div className="col-md-4 mb-3">
                                    <div className="card p-3">
                                        <h5>Team 4</h5>
                                        <p>Details about team 4.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="card p-3">
                                        <h5>Team 5</h5>
                                        <p>Details about team 5.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="card p-3">
                                        <h5>Team 6</h5>
                                        <p>Details about team 6.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="card p-3">
                                        <h5>Team 7</h5>
                                        <p>Details about team 7.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="card p-3">
                                        <h5>Team 8</h5>
                                        <p>Details about team 8.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="card p-3">
                                        <h5>Team 9</h5>
                                        <p>Details about team 9.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        
    };
    

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    firstLogin: state.auth.firstLogin,
});

export default connect(mapStateToProps)(ViewTeams);
