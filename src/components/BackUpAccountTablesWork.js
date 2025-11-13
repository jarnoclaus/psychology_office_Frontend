import { useState, useEffect } from "react";
import AllAppointments from './components/AllAppointments';

export default function AccountPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [status, setStatus] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [showList, setShowList] = useState(false);

    useEffect(() => {
        if (!user.isAdmin)
            fetchAppointmentsForUser();
        else
            fetchAllAppointments();

        async function fetchAllAppointments() {
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
            console.log(data);
        }

        async function fetchAppointmentsForUser() {
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
    }, [user.isAdmin]
    );

    const handleClick = () => { setShowList(!showList) };

    return (
        <div>
            {user && <div>
                <h1>Welkom {user.fullName}!</h1>
                <h3>{user.isAdmin ? <p>U bent admin!</p> : <p>U bent geen admin!</p>}</h3>
            </div>}
            {/* Button needs to show for both admin & user, but different functionality */}
            <button onClick={handleClick}>Show all appointments</button>
            {status && <p>{status}</p>}
            {!user.isAdmin ? (
                showList ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments?.map(a => {
                                    const date = new Date(a.startTime);
                                    return (
                                        <tr key={a.id}>
                                            <td>
                                                {date.toLocaleString('nl-BE', { dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (<p>Your next appointment is: {new Date(appointments[0]?.startTime).toLocaleString('nl-BE', { dateStyle: 'short', timeStyle: 'short' })}</p>)
            ) : (
                showList && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Naam</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments?.map(a => {
                                    const date = new Date(a.startTime);
                                    return (
                                        <tr key={a.id}>
                                            <td>
                                                {a.userName}
                                            </td>
                                            <td>
                                                {date.toLocaleString('nl-BE', { dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    )
}