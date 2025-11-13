import { useCallback, useEffect, useState } from "react";
import AllAppointments from './components/AllAppointments';
import AddAppointment from "./components/AddAppointment";

export default function AccountPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [appointments, setAppointments] = useState([]);
    const [status, setStatus] = useState("");
    const [view, setView] = useState("");


    /* Function needs to be called inside child page to re-render the table when appointment gets added  */
    /* useCallback 'freezes' the object between component renders, otherwise it's recreated each render */
    const reloadAppointments = useCallback(() => {
        if (user.isAdmin) FetchAllAppointments(setAppointments);
        else FetchAllAppointmentsForUser(setAppointments, setStatus);
    }, [user.isAdmin]);

    /* Run this function everytime user.id changes or the Account page gets rendered */
    useEffect(() => {
        reloadAppointments()
    }, [user.id, reloadAppointments]);

    return (
        <div className="dashboard-header">
            <h1>Welkom {user.fullName}!</h1>
            {!user.isAdmin && appointments.length > 0 &&
                <p className="next-appointment">
                    Your next appointment is: {new Date(appointments[0]?.startTime).toLocaleString('en-BE', {
                        weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit',
                        hour: '2-digit', minute: '2-digit'
                    })}
                </p>
            }

            {/* Buttons needs to show for both admin & user, but different functionality */}
            <div className="account-dashboard">
                <aside className="sidebar">
                    <button onClick={() => setView("All")} className={view === 'All' ? 'active' : ''}>Show all appointments</button>
                    <button onClick={() => setView("Add")} className={view === 'Add' ? 'active' : ''}>Add appointment</button>
                    <button onClick={() => setView("Info")} className={view === 'Info' ? 'active' : ''}>Account Information</button>
                    {user.isAdmin && <button onClick={() => setView("Clients")} className={view === 'Clients' ? 'active' : ''}>View clients</button>}
                </aside>

                <main className="content">
                    {view === "All" && <AllAppointments user={user} appointments={appointments} status={status} />}
                    {view === "Add" && <AddAppointment user={user} reloadAppointments={reloadAppointments} />}
                </main>
            </div>
        </div >
    )
}

/* Functions in parent page because both children pages need access */
async function FetchAllAppointments(setAppointments) {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    setAppointments(data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)))
}

async function FetchAllAppointmentsForUser(setAppointments, setStatus) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:5000/api/appointments/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const data = await response.json();
        setAppointments(data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)));
    } catch (error) {
        setStatus(error.message);
    }
};