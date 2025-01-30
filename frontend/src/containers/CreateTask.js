import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from '../utils/axiosConfig';

const CreateTask = ({ isAuthenticated, user }) => {
    const [formData, setFormData] = useState({
        description: '',
        assigned_to: '', // Will be updated based on the team or user
        team: '',
        due_date: '',
        status: 'not_started',
    });
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const { description, assigned_to, team, due_date, status } = formData;
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch users and teams on initial render
        const fetchUsersAndTeams = async () => {
            try {
                const [usersRes, teamsRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/sop/users/`, { withCredentials: true }),
                    axios.get(`${process.env.REACT_APP_API_URL}/sop/teams/`, { withCredentials: true }),
                ]);

                setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
                setTeams(Array.isArray(teamsRes.data) ? teamsRes.data : []);
            } catch (err) {
                console.error('Failed to fetch users or teams:', err);
            }
        };

        fetchUsersAndTeams();
    }, []);

    useEffect(() => {
        if (team) {
            // If team is selected, filter users by that team
            const filtered = users.filter(user =>
                Array.isArray(user.teams) && user.teams.includes(Number(team))
            );
            setFilteredUsers(filtered);
        } else {
            // If no team is selected, include the logged-in user
            setFilteredUsers(users);
            // Set assigned_to to the logged-in user if no team is selected
            setFormData(prevData => ({
                ...prevData,
                assigned_to: user ? user.id : '', // Default to logged-in user
            }));
        }
    }, [team, users, user]); // Rerun this effect when team or users change

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/sop/tasks/`, formData, {
                withCredentials: true,
            });
            alert('Task created successfully!');
            navigate('/view/tasks');
        } catch (error) {
            console.error('Failed to create task:', error);
            alert('Failed to create task. Please try again.');
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mt-5 entry-container">
            <div className="card p-4 mx-auto" style={{ maxWidth: '400px' }}>
                <h1 className="text-center mb-4">Create Task</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group mb-4">
                        <label>Description</label>
                        <textarea
                            className="form-control"
                            placeholder="Description"
                            name="description"
                            value={description}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label>Team</label>
                        <select
                            className="form-control"
                            name="team"
                            value={team}
                            onChange={onChange}
                        >
                            <option value="">Select Team</option>
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group mb-4">
                        <label>Assigned To</label>
                        <select
                            className="form-control"
                            name="assigned_to"
                            value={assigned_to}
                            onChange={onChange}
                            required
                        >
                            <option value="">Select Member</option>
                            {filteredUsers.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group mb-4">
                        <label>Due Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="due_date"
                            value={due_date}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label>Status</label>
                        <select
                            className="form-control"
                            name="status"
                            value={status}
                            onChange={onChange}
                        >
                            <option value="not_started">Not Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="complete">Complete</option>
                        </select>
                    </div>
                    <button className="btn btn-primary w-100" type="submit">
                        Create Task
                    </button>
                </form>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user, // Get the logged-in user from the store
});

export default connect(mapStateToProps)(CreateTask);