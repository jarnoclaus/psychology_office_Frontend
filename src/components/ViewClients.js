import { useState } from "react"

export default function ViewClients({ users }) {
    const [status, setStatus] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState();

    const handleClick = async (userId, clearStatus) => {
        setSelectedUserId(userId)
        FetchAppointmentsForUser(userId, setAppointments, setStatus, setSelectedAppointment, clearStatus)
    }
    const handleDeleteAppointment = async () => {
        DeleteAppointmentForUser(selectedAppointment, selectedUserId, setStatus, setSelectedAppointment, handleClick)
    }
    return (
        <div className="viewclients">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Iban</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => {
                        return (
                            <tr key={u.id} onClick={() => handleClick(u.id, true)}>
                                <td>{u.fullName}</td>
                                <td>{u.email}</td>
                                <td>{u.address}</td>
                                <td>{u.iban}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <p></p>
            {appointments.length !== 0 &&
                <div>
                    <h2>Appointments for {appointments[0].userName}</h2>
                    <table className="viewclients-appointments">
                        <thead>
                            <tr>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(a => {
                                const date = new Date(a.startTime);
                                return (
                                    <tr key={a.id} onClick={() => { setSelectedAppointment(a); setStatus('') }} className={selectedAppointment?.id === a.id ? 'user-item selected' : 'user-item'}>
                                        <td>{date.toLocaleString('nl-BE', {
                                            weekday: 'long',
                                            day: '2-digit', month: '2-digit', year: '2-digit',
                                            hour: '2-digit', minute: '2-digit'
                                        })}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {selectedAppointment &&
                        <div>
                            <p className="warning">Are you sure you want to delete this appointment?</p>
                            <div className="confirm-buttons">
                                <button className="yes" onClick={handleDeleteAppointment}>Yes</button>
                                <button className="no" onClick={() => setSelectedAppointment(null)}>No</button>
                            </div>
                        </div>
                    }
                </div>
            }
            {status && <p className="status">{status}</p>}
        </div>
    )
}

async function FetchAppointmentsForUser(userId, setAppointments, setStatus, setSelectedAppointment, clearStatus = true) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:5000/api/appointments/user/${userId}`, {
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
        setSelectedAppointment('');
        if (clearStatus) setStatus('');
    } catch (error) {
        setAppointments([]);
        setStatus(error.message);
    }
}

async function DeleteAppointmentForUser(selectedAppointment, selectedUserId, setStatus, setSelectedAppointment, handleClick) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:5000/api/appointments/${selectedAppointment.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        setStatus('Appointment successfully deleted')
        setSelectedAppointment(null);
        handleClick(selectedUserId, false);
    } catch (error) {
        setStatus(error.message)
    }
}