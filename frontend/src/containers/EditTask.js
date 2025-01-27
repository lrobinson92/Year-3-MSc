import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from '../utils/axiosConfig';
import Autosuggest from 'react-autosuggest';

const EditTask = ({ isAuthenticated }) => {
    const { id } = useParams(); // Get task ID from URL
    const navigate = useNavigate(); // For redirecting after edit

    const [formData, setFormData] = useState({
        description: '',
        assigned_to: '',
        assigned_to_name: '',
        team: '',
        due_date: '',
        status: 'not_started'
    });
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const { description, assigned_to, assigned_to_name, team, due_date, status } = formData;

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/sop/tasks/${id}/`, {
                    withCredentials: true,
                });
                setFormData({
                    description: res.data.description,
                    assigned_to: res.data.assigned_to ? res.data.assigned_to.toString() : '',
                    assigned_to_name: res.data.assigned_to_name || '',
                    team: res.data.team ? res.data.team.toString() : '',
                    due_date: res.data.due_date,
                    status: res.data.status
                });
            } catch (err) {
                console.error('Failed to fetch task data:', err);
            }
        };

        const fetchUsersAndTeams = async () => {
            try {
                const usersRes = await axios.get(`${process.env.REACT_APP_API_URL}/sop/users/`, {
                    withCredentials: true,
                });
                setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);

                const teamsRes = await axios.get(`${process.env.REACT_APP_API_URL}/sop/teams/`, {
                    withCredentials: true,
                });
                setTeams(Array.isArray(teamsRes.data) ? teamsRes.data : []);
            } catch (err) {
                console.error('Failed to fetch users or teams:', err);
            }
        };

        fetchTask();
        fetchUsersAndTeams();
    }, [id]);

    useEffect(() => {
        if (team) {
            const teamUsers = users.filter(user => user.teams.includes(parseInt(team)));
            setSuggestions(teamUsers);
        } else {
            setSuggestions(users);
        }
    }, [team, users]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSuggestionsFetchRequested = ({ value }) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        const filteredUsers = inputLength === 0 ? [] : users.filter(user =>
            user.name.toLowerCase().includes(inputValue)
        );

        setSuggestions(filteredUsers);
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const getSuggestionValue = (suggestion) => suggestion.name;

    const renderSuggestion = (suggestion) => (
        <div>
            {suggestion.name}
        </div>
    );

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const selectedUser = users.find(user => user.name === assigned_to_name);
            await axios.put(`${process.env.REACT_APP_API_URL}/sop/tasks/${id}/`, {
                ...formData,
                assigned_to: selectedUser ? selectedUser.id : ''
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
        <div className='container mt-5 entry-container'>
            <div className="card p-4 mx-auto" style={{ maxWidth: '400px' }}>
                <h1 className="text-center mb-4">Edit Task</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group mb-4">
                        <label>Description</label>
                        <textarea
                            className='form-control'
                            placeholder='Description'
                            name='description'
                            value={description}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label>Team</label>
                        <select
                            className='form-control'
                            name='team'
                            value={team}
                            onChange={onChange}
                        >
                            <option value=''>Select Team</option>
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group mb-4">
                        <label>Assigned To</label>
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={{
                                placeholder: 'Assigned To',
                                value: assigned_to_name,
                                onChange: (e, { newValue }) => setFormData({ ...formData, assigned_to_name: newValue })
                            }}
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label>Due Date</label>
                        <input
                            type='date'
                            className='form-control'
                            name='due_date'
                            value={due_date}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label>Status</label>
                        <select
                            className='form-control'
                            name='status'
                            value={status}
                            onChange={onChange}
                        >
                            <option value='not_started'>Not Started</option>
                            <option value='in_progress'>In Progress</option>
                            <option value='complete'>Complete</option>
                        </select>
                    </div>
                    <button className="btn btn-primary w-100" type='submit'>Update Task</button>
                </form>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(EditTask);