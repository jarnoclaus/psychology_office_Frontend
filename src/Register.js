import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [iban, setIban] = useState("");
    const [street, setStreet] = useState("");
    const [postalcode, setPostalcode] = useState("");
    const [city, setCity] = useState("");
    const [status, setStatus] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 8)
            newErrors.password = "Password must be at least 8 characters";

        if (!iban) newErrors.iban = "Iban is required";
        else if (!/^BE\d{2}(?:\s?\d{4}){3}$/.test(iban)) newErrors.iban = "Invalid Belgian IBAN format";
        else if (!isValidIban(iban)) newErrors.iban = "Invalid IBAN";

        if (!name) newErrors.name = "Name is required";
        if (!surname) newErrors.surname = "Surname is required";
        if (!street) newErrors.street = "Street is required";
        if (!postalcode) newErrors.postalcode = "Postalcode is required";
        if (!city) newErrors.city = "City is requireed";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;
        const address = { street, postalcode, city };

        try {
            const response = await fetch("http://localhost:5000/api/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, surname, email, password, address, iban })
            });

            if (!response.ok) {
                const errorData = await response.json();
                // in api [FromBody] binds to dto before the endpoint runs !ModelState so no custom error message hence line below.
                const message = errorData.message || errorData.title || "Invalid input";
                throw new Error(message);
            }
            const data = await response.json();
            setStatus(data.message);
            navigate('/login')
        } catch (error) {
            setStatus(error.message);
        }
    }

    return (
        <div className="register-page">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Create an Account</h2>
                <div className="form-group">
                    <label>Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Milo" /></label><br />
                    {errors.name && <p className='error'>{errors.name}</p>}
                </div>
                <div className="form-group">
                    <label>Surname: <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Claus" /></label><br />
                    {errors.surname && <p className='error'>{errors.surname}</p>}
                </div>

                <div className="form-group">
                    <label>Email: <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="miloclaus@gmail.com" /></label><br />
                    {errors.email && <p className='error'>{errors.email}</p>}
                </div>

                <div className="form-group">
                    <label>Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" /></label><br />
                    {errors.password && <p className='error'>{errors.password}</p>}
                </div>

                <div className="form-group">
                    <label>Iban: <input type="text" value={iban} onChange={(e) => setIban(e.target.value)} placeholder="BE12 3456 7891 1234" /></label><br />
                    {errors.iban && <p className='error'>{errors.iban}</p>}
                </div>

                <div className="form-group">
                    <label>Street: <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Zelebaan 17" /></label><br />
                    {errors.street && <p className='error'>{errors.street}</p>}
                </div>

                <div className="form-row">
                    <div className="form-group half">
                        <label>Postalcode: <input type="text" value={postalcode} onChange={(e) => setPostalcode(e.target.value)} placeholder="9160" /></label><br />
                        {errors.postalcode && <p className='error'>{errors.postalcode}</p>}
                    </div>
                    <div className="form-group half">
                        <label>City: <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lokeren" /></label><br />
                        {errors.city && <p className='error'>{errors.city}</p>}
                    </div>
                </div>

                <button type="submit" className="primary-btn">Register</button>
            </form>
            {status && <p className='status'>{status}</p>}
        </div>
    );
}

function isValidIban(iban) {
    iban = iban.replace(/\s+/g, '').toUpperCase();

    const rearranged = iban.substring(4) + iban.substring(0, 4);

    let numeric = "";
    for (let i = 0; i < rearranged.length; i++) {
        const ch = rearranged[i];
        if (/[A-Z]/.test(ch)) numeric += (ch.charCodeAt(0) - 55).toString();
        else numeric += ch;
    }

    let remainder = "";
    for (let i = 0; i < numeric.length; i += 7) {
        remainder = parseInt(remainder + numeric.substring(i, i + 7), 10) % 97;
    }

    return remainder === 1;
}