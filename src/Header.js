import './Header.css'
import AccountPicture from './images/Account.png'
import { useNavigate, Link } from 'react-router-dom';

export default function Header({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();

    const handleClick = async () => navigate('/account');
    const handleClickLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/account');
    };
    return (
        <header className='site-header'>
            <nav className='nav-bar'>
                <div className='nav-left'>
                    <Link to='/'><h3>Home</h3></Link>
                </div>
                <div className='nav-right'>
                    <img className='account-pic' src={AccountPicture} alt='Account' onClick={handleClick} />
                    {isLoggedIn && <button onClick={handleClickLogout} className='logout-btn'>Logout</button>}
                </div>
            </nav>
        </header>
    );
}