import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { FaArrowLeft } from 'react-icons/fa';

const InviteMember = () => {
    const { teamId } = useParams(); // Get team ID from URL
    const navigate = useNavigate(); // For redirecting after invite

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const onChange = (e) => setEmail(e.target.value);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/sop/teams/${teamId}/invite_member/`, { email });
            setMessage(res.data.message);
            alert("Invitation sent successfully!");
            navigate('/view/teams');
        } catch (err) {
            setMessage('Failed to send invitation');
        }
    };

    return (
        <div className='container mt-5 entry-container'>
            <FaArrowLeft className="back-arrow" onClick={() => navigate('/view/teams')} />
            <div className="card p-4 mx-auto" style={{ maxWidth: '400px' }}>
                <h1 className="text-center mb-4">Invite Member</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group mb-4">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Invite</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default InviteMember;