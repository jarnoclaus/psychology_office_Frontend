import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddAppointment({ user, reloadAppointments }) {
    const [status, setStatus] = useState("");
    const [excludedTimes, setExludedTimes] = useState([]);

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

    const handleClick = async () => {
        const token = localStorage.getItem('token');
        try {
            const pad = n => n.toString().padStart(2, '0');
            const localDateTime = `${startTime.getFullYear()}-${pad(startTime.getMonth() + 1)}-${pad(startTime.getDate())}T${pad(startTime.getHours())}:${pad(startTime.getMinutes())}`;

            const response = await fetch('http://localhost:5000/api/appointments/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ startTime: localDateTime })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            setStatus("Appointment added");
            reloadAppointments();
        } catch (error) {
            setStatus(error.message);
        }
    };

    /* Fetch all appointments for selected date and add to excluded times list */
    const handleOnChange = async (date) => {
        const token = localStorage.getItem('token');
        setStartTime(date);

        const dateString = date.toISOString().split('T')[0];
        const response = await fetch(`http://localhost:5000/api/appointments/by-date/${dateString}`, {
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
            <button onClick={handleClick} className="accept-btn">Accept</button>
            {status && <p className="status">{status}</p>}
        </div>
    );
}