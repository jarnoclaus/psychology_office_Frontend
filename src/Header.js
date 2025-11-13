import './Header.css'
import AccountPicture from './images/Account.png'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Header({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();

    const handleClick = async () => navigate('/account');
    const handleClickLogout = (e) => {
        e.preventDefault();
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/account');
    };
    return (
        <header>
            <nav>
                <Link to='/'><h3>Home</h3></Link>
                {isLoggedIn && <Link to='/login' onClick={handleClickLogout}><span>Logout</span></Link>}
                <img src={AccountPicture} alt='Account' onClick={handleClick} />
            </nav>
        </header>
    );
}