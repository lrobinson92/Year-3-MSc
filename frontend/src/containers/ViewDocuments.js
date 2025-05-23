import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar';
import GoogleDrive from '../components/GoogleDrive';


const ViewDocuments = ({ isAuthenticated }) => {

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            {/* Sidebar and Main Content */}
            <div className="d-flex">
                <Sidebar />
                <div className="main-content">
                    <div className="recent-items-card">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2>All Documents</h2>
                            <Link to="#" className="btn btn-primary create-new-link">
                                + Create New Document
                            </Link>
                            <GoogleDrive />
                        </div>  
                        {/* Recent Items
                        <div className="row">
                            {Array.isArray(teams) && teams.length > 0 ? (
                                teams.map((team) => (
                                    <div className="col-md-4 mb-3" key={team.id}>
                                        <div className="card p-3 view">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h4>{team.name}</h4>
                                                <Dropdown>
                                                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                                        ...
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu className="custom-dropdown-menu">
                                                        <Dropdown.Item onClick={() => handleEdit(team.id)}>Edit</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleAddMembers(team.id)}>Add Members</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleDelete(team.id)}>Delete</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                            <ul className="member-list">
                                                {team.members.map((member) => (
                                                    <li key={member.id}>
                                                        <span
                                                            className="member-initial"
                                                            data-fullname={member.user_name}
                                                        >
                                                            {member.user_name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <p>{team.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No documents available</p>
                            )}
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, null)(ViewDocuments);
