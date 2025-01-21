import { NavLink } from 'react-router-dom';

const SideNavbar = () => {

    
    return (
        <nav className="col-md-2 d-none d-md-block sidebar">
            <div className="sidebar-sticky">
                {/* User Info */}
                <div className="user-info">
                    <p>Welcome</p>
                </div>

                {/* Sidebar Navigation */}
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive ? 'nav-link active' : 'nav-link'
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? 'nav-link active' : 'nav-link'
                            }
                        >
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/view/documents"
                            className={({ isActive }) =>
                                isActive ? 'nav-link active' : 'nav-link'
                            }
                        >
                            All Documents
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/view/tasks"
                            className={({ isActive }) =>
                                isActive ? 'nav-link active' : 'nav-link'
                            }
                        >
                            Tasks
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/view/teams"
                            className={({ isActive }) =>
                                isActive ? 'nav-link active' : 'nav-link'
                            }
                        >
                            Teams
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default SideNavbar;
