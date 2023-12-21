import { useState, useEffect } from "react";
import axios from 'axios';
import './Search.css';


export const Search = ({ searchText, handleSearchChange, handleSearch }) => {
    const [isTypeCollapseVisible, setIsTypeCollapseVisible] = useState(false);
    const [homePokemonTypes, setHomePokemonTypes] = useState([]);

/*==================================================================================================
====================================================================================================*/

    const toggleTypeCollapse = () => {
        setIsTypeCollapseVisible(!isTypeCollapseVisible);
    };

/*==================================================================================================
====================================================================================================*/

    // 서버 Pokemon Type 정보 가져오기 위해 정의
    useEffect(() => {
        axios.get('http://localhost:4001/pokemon-types')
        .then(response => {
            setHomePokemonTypes(response.data);

            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    return (
        <div className='search-wrap'>
        <div className='search-content'>
            <div className='search-div1'>
                <label className='search-label' htmlFor='pokemonSearch'>
                    <img className='search-icon' src={process.env.PUBLIC_URL + '/image/icon_ball_b.png'} alt="search" />
                    <p className='search-title'>포켓몬 도감</p>
                </label>
            </div>

            <div className='search-div2'>
                <input type="text" 
                    placeholder="포켓몬 이름 또는 설명, 특성 키워드를 입력해주세요." 
                    className='pokemon-search'
                    value={searchText}
                    onChange={handleSearchChange}
                    onKeyPress={(event) => event.key === 'Enter' && handleSearch()}
                />
                <button className='search-button' onClick={handleSearch}></button>
            </div>
        </div>

        <div className={`type-collapse ${isTypeCollapseVisible ? 'visible' : ''}`}>
            <div className="search-type">
                <ul className="search-type-ul">
                    {homePokemonTypes.map(data => (
                        <li key={data.type_id}>
                            <img className="search-type-img" src={data.type_color_image} alt={data.type_color_image} />
                            <p className="search-type-text">{data.type_name}</p>

                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <button className='button-detail no-style' onClick={toggleTypeCollapse}>
            <p className={`button-detail-txt ${isTypeCollapseVisible ? 'on' : ''}`}>
                {isTypeCollapseVisible ? '닫기' : '상세검색'}
            </p>
        </button>
    </div>
    );
}