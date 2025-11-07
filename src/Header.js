import './Header.css'
import Login from './login.js';
import Register from './Register.js';
import AccountPicture from './images/Account.png'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();

    const handleClick = async () => navigate('/account');
    return (
        <header>
            <nav>
                <Link to='/'><h3>Home</h3></Link>
                <img src={AccountPicture} alt='Account' onClick={handleClick} />
            </nav>
        </header>
    );
}