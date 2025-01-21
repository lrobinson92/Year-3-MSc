import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addMember } from '../actions/teamActions';

const AddMember = ({ teamId }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();

    const handleAddMember = () => {
        if (!email) {
            setMessage("Email is required.");
            return;
        }

        dispatch(addMember(teamId, email))
            .then(() => setMessage("Member added successfully!"))
            .catch((err) => setMessage(err));
    };

    const onChange = e => setEmail(e.target.value);

    if (message = "Member added successfully") {
        return <Navigate to='/view/teams' />
    }

    return (
        <div className="container mt-5">
        <div className="card p-4 mx-auto" style={{ maxWidth: '400px' }}>
            <h1 className="text-center mb-4" >Add New Team Member</h1>
            <div>
                <input
                    type='email'
                    placeholder='Enter New Member Email'
                    name='email'
                    autoComplete='email'
                    value={email}
                    onChange={onChange}
                    required
                />
            </div>
                <button className="btn btn-primary mt-4 w-100" onClick={handleAddMember}>Add Member</button>
                {message && <p>{message}</p>}
        </div>
    </div>
    );
};



export default AddMember;