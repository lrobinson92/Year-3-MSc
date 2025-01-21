import React from "react";


function Task({ task, onDelete }) {
    

    return (
        <div className="task-container">
            <p className="task-title">{task.title}</p>
            <p className="task-description">{task.description}</p>
            <p className="due-date">{task.due_date}</p>
            <p className="assigned_to">{task.assigned_to}</p>
            <p className="status">{task.status}</p>
            <button className="delete-button" onClick={() => onDelete(task.id)}>
                Delete
            </button>
        </div>
    );
}

export default Task