import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './containers/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Activate from './containers/Activate';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm';
import Dashboard from "./containers/Dashboard";
import ViewDocuments from "./containers/ViewDocuments";
import ViewTeams from "./containers/ViewTeams";
import ViewTasks from "./containers/ViewTasks";
import ViewSOP from "./containers/ViewSOP";
import New from "./containers/New";
import Edit from "./containers/Edit";
import CreateTeam from "./containers/CreateTeam";
import './globalStyles.css';

import { Provider } from "react-redux";
import store from './store';

import Layout from './hocs/Layout';

const App = () => (
    <Provider store={store}>
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/reset-password' element={<ResetPassword />} />
                    <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />} />
                    <Route path="/auth/activate/:uid/:token" element={<Activate />} />
                    <Route path="/view/dashboard" element={<Dashboard />} />
                    <Route path='/view/documents' element={<ViewDocuments />} />
                    <Route path='/view/teams' element={<ViewTeams />} />
                    <Route path='/create-team' element={<CreateTeam />} />
                    <Route path='/view/tasks' element={<ViewTasks />} />
                    <Route path='/view/sop' element={<ViewSOP />} />
                    <Route path='/new' element={<New />} />
                    <Route path='/edit' element={<Edit />} />
                    <Route path='*' element={<h1>Route Not Found</h1>} />
                </Routes>            
            </Layout>
        </Router>
    </Provider>
);

export default App;