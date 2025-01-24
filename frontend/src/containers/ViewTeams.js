import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar';
import axios from '../utils/axiosConfig';


const ViewTeams = ({ isAuthenticated, firstLogin }) => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/sop/teams/`, {
                    withCredentials: true,  // Include credentials in the request
                });
                setTeams(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch teams');
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (firstLogin) {
        return <Navigate to="/dashboard" />;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
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
                            {Array.isArray(teams) && teams.length > 0 ? (
                                teams.map((team) => (
                                    <div className="col-md-4 mb-3" key={team.id}>
                                        <div className="card p-3">
                                            <h5>{team.name}</h5>
                                            <ul>
                                                {team.members.map((member) => (
                                                    <li key={member.id}>{member.user_name}</li>
                                                ))}
                                            </ul>
                                            <p>{team.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No teams available</p>
                            )}
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
