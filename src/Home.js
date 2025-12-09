import FirstCard from './images/First-card.png'
import { useNavigate } from 'react-router-dom'
import SecondCard from './images/group_therapy.png'

export default function HomePage() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLoginClick = async () => navigate('/login');
    const handleRegisterClick = async () => navigate('register');
    return (
        <div className='homepage'>
            <div className='banner'>
                <div className='head'>
                    <h1>Welcome to Laeny's psychological guidance office</h1>
                    <h2>A safe space to understand, grow and heal</h2>
                    {token === null && <div className='head-buttons'>
                        <button onClick={handleLoginClick}>Login</button>
                        <button onClick={handleRegisterClick}>Register</button>
                    </div>}
                </div>
            </div>
            <div className="cards">
                <div className="card">
                    <div className="card-text">
                        <h2>Your mental wellness journey starts here</h2>
                        <p>Meaningful conversations can bring understanding, comfort,
                            and insight. Together, we take the next step toward emotional wellbeing.</p>
                    </div>
                    <div className="card-img">
                        <img src={FirstCard} alt="soft line art" />
                    </div>
                </div>
                <div className='card'>
                    <div className='card-img'>
                        <img src={SecondCard} alt='group therapy' />
                    </div>
                    <div className='card-text'>
                        <h2>You are not alone</h2>
                        <p>Connect with a supportive community that understands your challenges.
                            Sharing experiences can lighten the load and inspire hope.</p>
                    </div>
                </div>
            </div>
        </div >
    );
}