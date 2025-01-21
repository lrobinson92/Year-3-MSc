import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';
import SideNavbar from '../components/SideNavbar';
import Task from '../components/Task';
import api from '../api';
import { Navigate } from 'react-router-dom';

const ViewTasks = ( {isAuthenticated }) => {




    const [tasks, setTasks] = useState([]);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [due_date, setDueDate] = useState("");
    const [assigned_to, setAssignedTo] = useState("");
    const [status, setStatus] = useState("");

    
    const getTasks = useCallback(() => {
        api
            .get("/view/tasks/")
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : [];
                setTasks(data);
                console.log(data);
            })
            .catch((err) => alert(err.response?.data || "Error fetching tasks"));
    }, []);

    useEffect(() => {
            getTasks();
        }, [getTasks]);

    const deleteTask = (id) => {
        api
            .delete(`/view/tasks/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Task deleted!");
                else alert("Failed to delete task.");
                getTasks();
            })
            .catch((error) => alert(error));
    };

    const createTask = (e) => {
        e.preventDefault();
        api
            .post("/view/tasks/", { title, description, assigned_to, due_date, status })
            .then((res) => {
                if (res.status === 201) alert("Task created!");
                else alert("Failed to make task.");
                getTasks();
            })
            .catch((err) => alert(err));
    };


    if (!isAuthenticated) {
        return <Navigate to='/login' />
    }

    return (
        <div>
            {/* Sidebar and Main Content */}
            <div className="d-flex">
                <SideNavbar />
                <div className="main-content" style={{ padding: '1rem', flex: 1 }}>
                    <div>
                        <h2>Tasks</h2>
                        {tasks.map((task) => (
                        <Task task={task} onDelete={deleteTask} key={task.id} />
                        ))}
                    </div>
                    <h2>Create a Task</h2>
                    <form onSubmit={createTask}>
                        <label htmlFor="title">Title:</label>
                        <br />
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                        <label htmlFor="description">Description:</label>
                        <br />
                        <textarea
                            id="description"
                            name="description"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                        <br />
                        <input
                            type="text"
                            id="assigned_to"
                            name="assigned_to"
                            required
                            onChange={(e) => setAssignedTo(e.target.value)}
                            value={assigned_to}
                        />
                        <input
                            type="date"
                            id="due_date"
                            name="due_date"
                            required
                            onChange={(e) => setDueDate(e.target.value)}
                            value={due_date}
                        />
                        <input
                            type="text"
                            id="status"
                            name="status"
                            required
                            onChange={(e) => setStatus(e.target.value)}
                            value={status}
                        />
                        <input type="submit" value="Submit"></input>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ViewTasks;
