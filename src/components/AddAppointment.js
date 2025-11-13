import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddAppointment(user) {
    const [startTime, setStartTime] = useState(new Date());
    const [status, setStatus] = useState("");
    const [excludedTimes, setExludedTimes] = useState([]);

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
        } catch (error) {
            setStatus(error.message);
        }
    };

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
        console.log(data);
    }
    return (
        <div className="Date">
            <h3>Select appointment date and time</h3>
            <DatePicker
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
            <button onClick={handleClick}>Accept</button>
            {status && <p style={{ color: 'red' }}>{status}</p>}
        </div>
    );
}