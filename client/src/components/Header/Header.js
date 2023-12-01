import { Link, useNavigate } from "react-router-dom";
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        // '/' 경로로 이동하면서 스크롤 위치를 최상단으로 이동
        navigate('/');
        window.scrollTo(0, 0);
    };
    
    return(
        <header>
            <h1 className="logo" onClick={handleLogoClick}>
                <Link to="/"><img src="./image/logo.png" alt="home" /></Link>
            </h1>

            <div className="nav">
			    <ul className="acc">
			    	<li>
                        <Link to="/" className="acc_a">
                            <img src="./image/icon_ball_c.png" alt="guidebook" />
                            <span className="acc_tit">포켓몬 도감</span>
                        </Link>
			    	</li>
    
			    	<li>
			    		<Link to="/registration" className="acc_a">
                            <img src="./image/icon_register.png" alt="guidebook" />
                            <span className="acc_tit">포켓몬 등록</span>
                        </Link>
			    	</li>

                    <li>
			    		<Link to="/evolution" className="acc_a">
                            <img src="./image/icon_evo.png" alt="guidebook" />
                            <span className="acc_tit">포켓몬 진화</span>
                        </Link>
			    	</li>
			    </ul>
            </div>

            <Link to="https://www.pokemonstore.co.kr/" target="_blank" className="btn-site">
                <img className="site-img" src="./image/site2.png" alt="site" />
            </Link>
        </header>
    )
}

export default Header;