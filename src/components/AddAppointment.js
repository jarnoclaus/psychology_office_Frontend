import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddAppointment({ user, allUsers }) {
    const [status, setStatus] = useState("");
    const [excludedTimes, setExludedTimes] = useState([]);
    const [inputSearch, setInputSearch] = useState("");
    const [userId, setUserId] = useState(0);

    /* Datepicker shows current date and time as default so user can make wrong appointments 
        Get the current hour without minutes and add 1
    */
    const getNextHour = () => {
        const now = new Date();
        now.setMinutes(0, 0, 0);
        now.setHours(now.getHours() + 1);
        return now;
    }
    const [startTime, setStartTime] = useState(getNextHour());

    /* Add appointment */
    const handleClick = async () => {
        const token = localStorage.getItem('token');
        try {
            // const pad = n => n.toString().padStart(2, '0');
            // const localDateTime = `${startTime.getFullYear()}-${pad(startTime.getMonth() + 1)}-${pad(startTime.getDate())}T${pad(startTime.getHours())}:${pad(startTime.getMinutes())}`;
            const utcDateTimeString = startTime.toISOString();
            const api = user.isAdmin ? 'https://psychologyoffice.onrender.com/api/appointments/admin/add' : 'https://psychologyoffice.onrender.com/api/appointments/add';
            const apiBody = user.isAdmin ? JSON.stringify({ startTime: utcDateTimeString, userId: userId }) : JSON.stringify({ startTime: utcDateTimeString });

            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: apiBody
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            setInputSearch('');
            setUserId(0);
            setStatus("Appointment added");
        } catch (error) {
            setStatus(error.message);
        }
    };

    /* Fetch all appointments for selected date and add to excluded times list */
    const handleOnChange = async (date) => {
        /* If date is null, undefined or minutes are not 0 show error
            Users can still edit the date/time DatePicker field
        */
        if (!date) return;

        if (date.getMinutes() !== 0) {
            setStatus("Please select a full hour.");
            return;
        }
        setStatus('');

        const token = localStorage.getItem('token');
        setStartTime(date);

        const pad = (n) => n.toString().padStart(2, '0');
        const dateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const response = await fetch(`https://psychologyoffice.onrender.com/api/appointments/by-date/${dateString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        const data = await response.json();

        const times = data.map(d => new Date(d.startTime));
        setExludedTimes(times);
    }

    /* When a state changes, component re-renders so list gets updated */
    const filteredUsers = allUsers?.filter(u => u.fullName.toLowerCase().includes(inputSearch.toLowerCase()));

    return (
        <div className="add-appointment">
            <h3>Select appointment date and time</h3>
            <DatePicker className="datepicker"
                selected={startTime}
                onChange={handleOnChange}
                showTimeSelect
                dateFormat='yyyy-MM-dd HH:mm'
                timeFormat="HH:mm"
                timeIntervals={60}
                timeCaption="Time"
                minTime={new Date(new Date().setHours(9, 0, 0))}
                maxTime={new Date(new Date().setHours(17, 0, 0))}
                filterDate={date => date.getDay() !== 0 && date.getDay() !== 6}
                popperPlacement="right-start"
                excludeTimes={excludedTimes}
            />
            {user.isAdmin && <label>Client: <input type="search" value={inputSearch} onChange={(e) => setInputSearch(e.target.value)} /></label>}
            {allUsers && inputSearch && filteredUsers !== 0 && <div className="user-list" >
                <ul>
                    {filteredUsers.map(u => {
                        return (
                            <li key={u.id} onClick={() => setUserId(u.id)}
                                className={userId === u.id ? 'user-item selected' : 'user-item'}
                            >{u.fullName} ({u.email})</li>
                        )
                    })}
                </ul>
            </div>}
            <button onClick={handleClick} className="accept-btn">Accept</button>
            {status && <p className="status">{status}</p>}
        </div >
    );
}