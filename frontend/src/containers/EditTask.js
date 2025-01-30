import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from '../utils/axiosConfig';
import { FaArrowLeft } from 'react-icons/fa'; // Import the back arrow icon

const EditTask = ({ isAuthenticated, user }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        description: '',
        assigned_to: '',
        team: '',
        due_date: '',
        status: 'not_started',
    });
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const { description, assigned_to, team, due_date, status } = formData;

    useEffect(() => {
        const fetchTaskAndData = async () => {
            try {
                const [taskRes, usersRes, teamsRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/sop/tasks/${id}/`, { withCredentials: true }),
                    axios.get(`${process.env.REACT_APP_API_URL}/sop/users/`, { withCredentials: true }),
                    axios.get(`${process.env.REACT_APP_API_URL}/sop/teams/`, { withCredentials: true }),
                ]);

                setFormData({
                    description: taskRes.data.description,
                    assigned_to: taskRes.data.assigned_to ? taskRes.data.assigned_to.toString() : '',
                    team: taskRes.data.team ? taskRes.data.team.toString() : '',
                    due_date: taskRes.data.due_date,
                    status: taskRes.data.status,
                });

                setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
                setTeams(Array.isArray(teamsRes.data) ? teamsRes.data : []);
            } catch (err) {
                console.error('Failed to fetch task or data:', err);
            }
        };

        fetchTaskAndData();
    }, [id]);

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const usersRes = await axios.get(`${process.env.REACT_APP_API_URL}/sop/users/`, {
              withCredentials: true,
            });
            console.log("Users from API:", usersRes.data); // Check for 'teams' field here
            setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
          } catch (err) {
            console.error("Failed to fetch users:", err);
          }
        };
        fetchUsers();
      }, []);
      

    useEffect(() => {
        // Debugging the team filtering logic
        if (team) {
            console.log(`Filtering users for team: ${team}`);
            const filtered = users.filter(user => {
                console.log(`Checking user: ${user.name}, Teams: ${user.teams}`);
                return Array.isArray(user.teams) && user.teams.includes(parseInt(team));
            });

            console.log('Filtered Users:', filtered);
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(user ? [user] : []);
        }
    }, [team, users, user]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/sop/tasks/${id}/`, {
                ...formData,
                assigned_to: assigned_to || user.id, // Default to logged-in user if no selection
            }, {
                withCredentials: true,
            });
            alert("Task updated successfully!");
            navigate('/view/tasks');
        } catch (error) {
            alert("Failed to update task. Please try again.");
        }
    };


    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mt-5 entry-container">
            <FaArrowLeft className="back-arrow" onClick={() => navigate('/view/tasks')} />
            <div className="card p-4 mx-auto" style={{ maxWidth: '400px' }}>
                <div className="d-flex align-items-center mb-4">
                    
                    <h1 className="text-center flex-grow-1 mb-0">Edit Task</h1>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="form-group mb-3">
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
                    <div className="form-group mb-3">
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
                    <div className="form-group mb-3">
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
                    <div className="form-group mb-3">
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
                    <div className="form-group mb-3">
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
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-primary w-100" type="submit">
                            Update Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
});

export default connect(mapStateToProps)(EditTask);
