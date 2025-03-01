import React from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar';
import { onedriveLogin, uploadDocument } from '../actions/onedrive';
import { useEffect } from "react";

const ViewDocuments = ({ isAuthenticated, onedriveLogin, uploadDocument }) => {
    
    const fetchOneDriveFiles = async () => {
        const response = await fetch("http://localhost:8000/api/onedrive/files", {
            credentials: "include",  // Sends cookies (access token)
        });
        const data = await response.json();
        console.log(data);
    };
    
    const [searchParams] = useSearchParams();
    const onedriveToken = searchParams.get("onedrive_token");

    useEffect(() => {
        const fetchTokens = async () => {
            if (onedriveToken) {
                try {
                    const response = await fetch(`http://localhost:8000/onedrive/callback/?code=${onedriveToken}`);
                    const data = await response.json();
                    if (data.redirect) {
                        window.location = data.redirect;  // ✅ Force frontend redirect
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        };

        fetchTokens();
    }, [onedriveToken]);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    const handleLogin = () => {
        onedriveLogin();
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        await uploadDocument(file);
    };

    return (
        <div>
            {/* Sidebar and Main Content */}
            <div className="d-flex">
                <Sidebar />
                <div className="main-content">
                    <div className="recent-items-card">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2>All Documents</h2>
                            <Link to="/create-document" className="btn btn-primary create-new-link">
                                + Create New Document
                            </Link>
                        </div>
                        <button onClick={handleLogin} className="btn btn-primary">Login to OneDrive</button>
                        <input type="file" onChange={handleFileUpload} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
});

export default connect(mapStateToProps, { onedriveLogin, uploadDocument })(ViewDocuments);