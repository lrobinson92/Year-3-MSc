import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';


const SideNavbar = ({ }) => {


    return (
        <nav className="col-md-2 d-none d-md-block sidebar">
            <div className="sidebar-sticky">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <NavLink 
                            to="/login" 
                            className="nav-link" 
                            activeClassName="active">
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink 
                            exact
                            to="/" 
                            className="nav-link" 
                            activeClassName="active">
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink 
                            to="/view/documents" 
                            className="nav-link" 
                            activeClassName="active">
                            All Documents
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink 
                            to="/view/tasks" 
                            className="nav-link" 
                            activeClassName="active">
                            Tasks
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink 
                            to="/view/teams" 
                            className="nav-link" 
                            activeClassName="active">
                            Teams
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};


export default SideNavbar;