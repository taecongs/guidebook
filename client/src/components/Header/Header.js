import { Link } from "react-router-dom";
import './Header.css';

const Header = () => {
    // const navigate = useNavigate();

    const handleLogoClick = () => {
        // '/' 경로로 이동하면서 스크롤 위치를 최상단으로 이동
        // navigate('/');
        window.scrollTo(0, 0);

        // 로고 클릭 시 새로고침 후 렌더링
        window.location.reload();
    };
    
    return(
        <header>
            <h1 className="logo" onClick={handleLogoClick}>
                <Link to="/"><img src={process.env.PUBLIC_URL + '/image/logo.png'} alt="home" /></Link>
            </h1>

            <div className="nav">
			    <ul className="acc">
			    	<li>
                        <Link to="/" className="acc_a">
                            <img src={process.env.PUBLIC_URL + '/image/icon_ball_c.png'} alt="포켓몬 도감 아이콘" />
                            <span className="acc_tit">포켓몬 도감</span>
                        </Link>
			    	</li>
    
			    	<li>
			    		<Link to="/registration" className="acc_a">
                            <img src={process.env.PUBLIC_URL + '/image/icon_register.png'} alt="포켓몬 등록 아이콘" />
                            <span className="acc_tit">포켓몬 등록</span>
                        </Link>
			    	</li>

                    <li>
			    		<Link to="/evolution" className="acc_a">
                            <img src={process.env.PUBLIC_URL + '/image/icon_evo.png'} alt="포켓몬 진화 아이콘" />
                            {/* <img src="./image/icon_evo.png" alt="guidebook" /> */}
                            <span className="acc_tit">포켓몬 진화</span>
                        </Link>
			    	</li>
			    </ul>
            </div>

            <Link to="https://www.pokemonstore.co.kr/" target="_blank" className="btn-site">
                <img className="site-img" src={process.env.PUBLIC_URL + '/image/site2.png'} alt="site" />
            </Link>
        </header>
    )
}

export default Header;