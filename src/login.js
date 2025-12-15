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
        try {
            const response = await fetch("https://psychologyoffice.onrender.com/api/user/login", {
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

            const data = await response.json();
            localStorage.setItem('token', data.jwt);
            localStorage.setItem('user', JSON.stringify({ fullName: data.fullName, isAdmin: data.isAdmin, id: data.id }));

            setStatus("Successfully logged in!");
            setEmail("");
            setPassword("");
            setIsLoggedIn(true);
            navigate('/account');
        } catch (error) {
            setStatus(error.message)
        }
    };

    const handleRegiserSubmit = (e) => {
        e.preventDefault();
        navigate('/register');
    }

    return (
        <div className='login-page'>
            <form onSubmit={handleSubmit} className='login-form'>
                <h2>Login</h2>
                <label>Email: <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete='email'
                    placeholder='milo@gmail.com' /> </label>
                {errors.email && <p className='error'>{errors.email}</p>}
                <label>Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='********' /></label>
                {errors.password && <p className='error'>{errors.password}</p>}
                <button type='submit' className='primary-btn'>Login</button>
            </form>
            <form onSubmit={handleRegiserSubmit} className='register-form-login'>
                <button type='submit' className='secondary-btn'>Register</button>
            </form>
            {status && <p className='status'>{status}</p>}
        </div>
    );
}