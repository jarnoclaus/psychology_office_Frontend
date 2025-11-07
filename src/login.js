import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email";

        if (!password) newErrors.password = "Password is required";
        else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus("Sending...");

        try {
            const response = await fetch("http://localhost:5000/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            setStatus("Successfully logged in!");
            setEmail("");
            setPassword("");
            setIsLoggedIn(true);
            navigate('/account');
        } catch (error) {
            setStatus(error.message)
        }
    };

    const handleRegiserSubmit = () => {
        navigate('/register');
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>email: <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete='email' /> </label>
                {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                <label>password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
                {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                <button type='submit'>Login</button>
            </form>
            <form onSubmit={handleRegiserSubmit}>
                <button type='submit'>Register</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
}