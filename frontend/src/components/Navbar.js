import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';

const Navbar = ({ logout, isAuthenticated }) => {
    const navigate = useNavigate(); // React Router hook for navigation

    const handleLogout = () => {
        logout(); // Dispatch logout action
        navigate('/'); // Redirect to the homepage
    };

    const guestLinks = () => (
        <Fragment>
            <div className="d-flex ms-auto flex-wrap">
                <Link to="/login" className="btn btn-outline-primary me-2 mb-2 mb-lg-0">
                    Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary mb-2 mb-lg-0">
                    Get Started
                </Link>
            </div>
        </Fragment>
    );

    const authLinks = () => (
        <div className="d-flex ms-auto flex-wrap">
            <button
                className="btn btn-outline-primary me-2 mb-2 mb-lg-0"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );

    return (
        <nav className="navbar navbar-light bg-light px-4">
            <Link className="navbar-brand" to="/">
                SOPify
            </Link>
            {isAuthenticated ? authLinks() : guestLinks()}
        </nav>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated, // Correctly map the isAuthenticated state
});

export default connect(mapStateToProps, { logout })(Navbar);
