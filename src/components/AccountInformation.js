import { useState, useEffect } from "react"
export default function AccountInformation() {
    const [userInfo, setUserInfo] = useState({});
    const [allowEdit, setAllowEdit] = useState(false);

    useEffect(() => {
        FetchUserData(setUserInfo);
    }, [])
    /* If user can edit -> show button submit and cancel
    submit to update user info or cancel and reset values
     */
    return (
        <div>
            <form>
                <label>Naam: <input value={userInfo.name} readOnly={!allowEdit}></input></label>
                <label>Voornaam: <input value={userInfo.surname} readOnly={!allowEdit}></input></label>
                <label>Email: <input value={userInfo.email} readOnly={!allowEdit}></input></label>
                <label>Address:
                    <input value={userInfo.address.street} readOnly={!allowEdit}></input>
                    <input value={userInfo.address.postalCode} readOnly={!allowEdit}></input>
                    <input value={userInfo.address.city} readOnly={!allowEdit}></input>
                </label>
                <label>Iban: <input value={userInfo.iban} readOnly={!allowEdit}></input></label>
            </form>
            {!allowEdit && <button onClick={() => setAllowEdit(!allowEdit)}>Edit</button>}
            {allowEdit &&
                <div>
                    <button>Submit</button>
                    <button onClick={() => setAllowEdit(!allowEdit)}>Cancel</button>
                </div>
            }
        </div>
    )
}

async function FetchUserData(setUserInfo) {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/user/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    const data = await response.json();
    setUserInfo(data);
}