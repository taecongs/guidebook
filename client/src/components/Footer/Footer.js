import { Link } from "react-router-dom";
import './Footer.css';

const Footer = () => {
    return(
        <footer>
            <h1 class="footer-logo">
                <img src="./image/ft_logo.png" alt="footer" />

                <div class="sidemap">
                    <Link to="" class="sm-1">
                        <span>포켓몬 도감</span>
                    </Link>

                    <span class="sm-line">|</span>

                    <Link to="" class="sm-2">
                        <span>포켓몬 등록</span>
                    </Link>
                </div>
            </h1>
            

            <div class="copy">
                <p class="copy-txt">Copyright ©2023, BANG is Pokémon Guidebook Project All Rights Reserved.</p>
                {/* <p>Copyright ©2023, BANG is Pokémon Guidebook Project All Rights Reserved. <span class="lu-txt">Latest Updated  2023년 12월 31일</span></p> */}
            </div>
        </footer>
    )
}

export default Footer;