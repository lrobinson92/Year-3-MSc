import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { editTeam } from '../actions/team';
import axios from '../utils/axiosConfig';

const EditTeam = ({ editTeam }) => {
    const { id } = useParams(); // Get team ID from URL
    const navigate = useNavigate(); // For redirecting after edit

    const [formData, setFormData] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);

    const { name, description } = formData;

    useEffect(() => {
        // Fetch team data based on the ID
        const fetchTeam = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/sop/teams/${id}/`, {
                    withCredentials: true,
                });
                setFormData({ name: res.data.name, description: res.data.description });
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch team data:', err);
            }
        };
        fetchTeam();
    }, [id]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await editTeam(id, name, description);
            alert("Team updated successfully!");
            navigate('/view/teams');
        } catch (error) {
            alert("Failed to update team. Please try again.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container mt-5 entry-container'>
            <div className="card p-4 mx-auto" style={{ maxWidth: '400px' }}>
                <h1 className="text-center mb-4">Edit Team</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group mb-4">
                        <input
                            className='form-control'
                            type='text'
                            placeholder='Team Name*'
                            name='name'
                            value={name}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className='form-group mb-4'>
                        <textarea
                            className='form-control'
                            placeholder='Description'
                            name='description'
                            value={description}
                            onChange={onChange}
                        />
                    </div>
                    <button className="btn btn-primary w-100" type='submit'>Update Team</button>
                </form>
            </div>
        </div>
    );
};

export default connect(null, { editTeam })(EditTeam);