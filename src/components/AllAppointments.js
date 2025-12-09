export default function AllAppointments({ user, appointments, status }) {
    return (
        <div>
            {!user.isAdmin ? (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th colSpan='2'>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments?.map(a => {
                                const date = new Date(a.startTime);
                                return (
                                    <tr key={a.id}>
                                        <td>
                                            {date.toLocaleString('en-BE', {
                                                weekday: 'long',

                                            })}
                                        </td>
                                        <td>
                                            {date.toLocaleString('en-BE', {
                                                day: '2-digit', month: '2-digit', year: '2-digit',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
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
                                            {date.toLocaleString('nl-BE', {
                                                weekday: 'long',
                                                day: '2-digit', month: '2-digit', year: '2-digit',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )
            }
            {status && appointments.length === 0 && <p className="status">{status}</p>}
        </div>
    )
}