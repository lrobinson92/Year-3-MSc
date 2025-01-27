import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar';
import axios from '../utils/axiosConfig';

const ViewTasks = ({ isAuthenticated, firstLogin }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/sop/tasks/`, {
                    withCredentials: true,  // Include credentials in the request
                });
                console.log('Fetched tasks:', res.data); // Log the fetched tasks
                setTasks(res.data.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)));
            } catch (err) {
                console.error(err);
                setError('Failed to fetch tasks');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
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
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2>My Tasks</h2>
                            <Link to="/create-task" className="btn btn-primary create-new-link">
                                + Create New Task
                            </Link>
                        </div>  
                        {/* Recent Items */}
                        <div className="row">
                            {Array.isArray(tasks) && tasks.length > 0 ? (
                                <div className="col-12 mb-3">
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Description</th>
                                                    <th>Assigned To</th>
                                                    <th>Team</th>
                                                    <th>Due Date</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tasks.map((task) => (
                                                    <tr key={task.id}>
                                                        <td>{task.description}</td>
                                                        <td>{task.assigned_to_name}</td>
                                                        <td>{task.team_name}</td>
                                                        <td>{new Date(task.due_date).toLocaleDateString()}</td>
                                                        <td>{task.status.replace('_', ' ')}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => navigate(`/edit-task/${task.id}`)}
                                                            >
                                                                Edit
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <p>You have no tasks</p>
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

export default connect(mapStateToProps)(ViewTasks);