import React, { useEffect, useState } from "react";
import AddMember from "./AddMember"
import axios from "axios";

const ViewTeams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user's teams
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get("/api/teams/my_teams/");
                setTeams(response.data);
            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);


    const handleLeaveTeam = async (teamId) => {
        try {
            await axios.post(`/api/teams/${teamId}/leave_team/`);
            setTeams(teams.filter(team => team.id !== teamId));
            alert("You left the team");
        } catch (error) {
            console.error("Error leaving team:", error);
        }
    };

    const handleDeleteTeam = async (teamId) => {
        try {
            await axios.delete(`/api/teams/${teamId}/`);
            setTeams(teams.filter(team => team.id !== teamId));
            alert("Team deleted");
        } catch (error) {
            console.error("Error deleting team:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="teams">
            <h1>Your Teams</h1>
            {teams.map((team) => (
                <div key={team.id} className="team-card">
                    <h2>{team.name}</h2>
                    <p>Created By: {team.created_by}</p>
                    <ul>
                        {team.members.map(member => (
                            <li key={member.id}>{member.user} - {member.role}</li>
                        ))}
                    </ul>
                    <AddMember teamId={team.id} />
                    <button onClick={() => handleLeaveTeam(team.id)}>Leave Team</button>
                    {team.created_by === "current_user_id" && (
                        <button onClick={() => handleDeleteTeam(team.id)}>Delete Team</button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ViewTeams;
