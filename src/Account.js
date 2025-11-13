import { useState } from "react";
import AllAppointments from './components/AllAppointments';
import AddAppointment from "./components/AddAppointment";

export default function AccountPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [showList, setShowList] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const handleClick = () => { setShowList(!showList) };
    const handleClickAdd = () => { setShowAdd(!showAdd) };

    return (
        <div>
            {user && <div>
                <h1>Welkom {user.fullName}!</h1>
                <h3>{user.isAdmin ? <p>U bent admin!</p> : <p>U bent geen admin!</p>}</h3>
            </div>}
            {/* Button needs to show for both admin & user, but different functionality */}
            <button onClick={handleClick}>Show all appointments</button>
            <button onClick={handleClickAdd}>Add appointment</button>
            {/* Also need to pass when it's false to show next appointment */}
            {showList ? <AllAppointments user={user} showList={showList} /> : <AllAppointments user={user} showList={showList} />}
            {showAdd && <AddAppointment user={user} />}
        </div>
    )
}