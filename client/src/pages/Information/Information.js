import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Information.css';
import { faMars, faVenus, faHome, faUndoAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Information = () => {
    const {serial} = useParams();
    const [pokemonData, setPokemonData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 해당 serial을 사용하여 데이터를 가져오는 API 호출
        fetch(`http://localhost:4001/guidebook/${serial}`)
            .then(response => response.json())
            .then(data => {
                // 성공적으로 데이터를 가져온 경우 상태 업데이트
                if (data && data.evo_list) {
                    // 진화 정보 정렬
                    data.evo_list = JSON.parse(data.evo_list).sort((a, b) => {
                        const serialA = parseInt(a.serial.replace("No.", ""));
                        const serialB = parseInt(b.serial.replace("No.", ""));
                        return serialA - serialB;
                    });
                }
                setPokemonData(data);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [serial]);

    // 타입 색상 정의
    const typeColors = {
        '풀': '#42bf24',
        '독': '#994dcf',
        '불꽃': '#ff612c',
        '비행': '#95c9ff',
        '물': '#2992ff',
        '벌레': '#9fa424',
        '노말': '#999999',
        '전기': '#ffdb00',
    }

    // 타입 이미지 정의
    const typeImages = {
        '풀': '/image/type/grass.png',
        '독': '/image/type/poison.png',
        '불꽃': '/image/type/fire.png',
        '비행': '/image/type/wind.png',
        '물': '/image/type/water.png',
        '벌레': '/image/type/bug.png',
    }

    // 속성 정의
    const characteristicDescriptions = {
        '심록': 'HP가 줄었을 때 풀타입 기술의 위력이 올라간다.',
        '맹화': 'HP가 줄었을 때 불꽃타입 기술의 위력이 올라간다.',
        '급류': 'HP가 줄었을 때 물타입 기술의 위력이 올라간다.',
        '인분': '인분에 보호받아 기술의 추가 효과를 받지 않게 된다.',
        '탈피': '몸의 껍질을 벗어 던져 상태 이상을 회복할 때가 있다.',
        '복안': '복안을 가지고 있어 기술의 명중률이 올라간다.',



    };

    return(
        <section>
            {pokemonData ? (
                <div className="info-container">
                    <div className="info-wrap">
                        <div className="pokemon-depth">
                            <div className="panel left-panel">

                                {/* [왼쪽] 이름, 시리얼 정의*/}
                                <div className="info-pokemon-name screen">
                                    <p>{pokemonData.name}</p>
                                    <span className="info-pokemon-serial">{serial}</span>
                                </div>

                                {/* [왼쪽] 이미지 정의 */}
                                <div className="info-pokemon-image">
                                    <img className="info-image-size" src={`/uploads/${pokemonData.serial}.png`} alt={pokemonData.name} />
                                </div>

                                {/* [왼쪽] 성별, 홈 버튼, 수정하기 버튼 정의 */}
                                <div className="info-sprite-controls all-controls">
                                    <div className="info-pokemon-gender">
                                        {pokemonData.gender.split(',').map((gender, index) => (
                                            <div className="gender-icon" key={index}>
                                                {gender.trim() === '남자' ? (
                                                    <FontAwesomeIcon icon={faMars} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faVenus} />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="info-sprite-controls">
                                        <Link className="info-pokemon-home-link" to='/'>
                                            <div className="info-pokemon-home-icon">
                                                <FontAwesomeIcon icon={faHome} />
                                            </div>                   
                                        </Link>
                                    </div>

                                    <div className="info-sprite-controls">
                                        <div className="info-pokemon-conven">
                                            {/* 수정하기 버튼 클릭 시? 수정 필요 할 수도 있다. */}
                                            <Link to=''>
                                                <div className="info-pokemon-refresh-icon">
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </div>                   
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* [왼쪽] 상세 설명 정의 */}
                                <div className="info-pokemon-detail screen">
                                    <p>{pokemonData.detail}</p>
                                </div>
                            </div>

                            {/* 중간 선 정의 */}
                            <div className="divider">
                                <div className="gap"></div>
                                <div className="hinge"></div>
                                <div className="gap"></div>
                                <div className="hinge"></div>
                                <div className="gap"></div>
                                <div className="hinge"></div>
                                <div className="gap"></div>
                            </div>

                            <div className="panel right-panel">
                                <div className="panel-row">
                                    {/* [오른쪽] 분류, 높이, 몸무게 정의 */}
                                    <div className="info-pokemon-stats screen">
                                        <div className="stats-line">
                                            <div className="stats-name">분류</div>
                                            <div className="stats-dots">·································</div>
                                            <div className="stats-txt">{pokemonData.category}</div>
                                        </div>

                                        <div className="stats-line">
                                            <div className="stats-name">높이</div>
                                            <div className="stats-dots">·································</div>
                                            <div className="stats-txt">{pokemonData.height.toFixed(1)}m</div>
                                        </div>

                                        <div className="stats-line">
                                            <div className="stats-name">몸무게</div>
                                            <div className="stats-dots">·································</div>
                                            <div className="stats-txt">{pokemonData.weight.toFixed(1)}m</div>
                                        </div>

                                    </div>

                                    {/* [오른쪽] 타입 정의 */}
                                    <div className="info-pokemon-type">
                                        <div className="panel-header">Types</div>
                                        <div className="type-box">
                                            <div style={{ backgroundColor: typeColors[pokemonData.type1] }} className="info-type1">
                                                <img className="info-type-img" src={typeImages[pokemonData.type1]} alt={pokemonData.type1} />
                                                {pokemonData.type1}
                                            </div>
                                                {pokemonData.type2 && (
                                                    <div style={{ backgroundColor: typeColors[pokemonData.type2] }} className="info-type2">
                                                        <img className="info-type-img" src={typeImages[pokemonData.type2]} alt={pokemonData.type2} />
                                                        {pokemonData.type2}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>

                                {/* [오른쪽] 진화 정보 이미지 정의 */}
                                {pokemonData && pokemonData.evo_list && (
                                    <div className="panel-row panel-evo">
                                        {/* 포켓몬의 진화 리스트를 매핑하여 각 진화에 대한 정보를 표시 */}
                                        {pokemonData.evo_list.map((evo, index) => (
                                            <div key={index}>
                                                <div className="evo-index">{index + 1}</div>
                                                <Link to={`/information/${evo.serial}`}>
                                                    <div className="evo-back"><img className="evo-img" src={`/uploads/${evo.serial}.png`} alt={evo.name} /></div>
                                                </Link>
                                                <div className="evo-name screen">{evo.name}</div>

                                                <div className="evo-type">
                                                    {/*  첫 번째 타입의 배경색 및 이미지를 표시 */}
                                                    <div style={{ backgroundColor: typeColors[evo.type1] }} className="evo-type1">
                                                        <img className="evo-type-img" src={typeImages[evo.type1]} alt={evo.type1} />
                                                        {evo.type1}
                                                    </div>
                                                        {/* 두 번째 타입이 존재하는 경우에만 해당 타입의 배경색 및 이미지를 표시 */} 
                                                        {evo.type2 && (
                                                            <div style={{ backgroundColor: typeColors[evo.type2] }} className="evo-type2">
                                                                <img className="evo-type-img" src={typeImages[evo.type2]} alt={evo.type2} />
                                                                {evo.type2}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* 기능은 없지만 도감에 있는 스타일링  */}
                                <div className="panel-row blue-buttons">
                                    <div class="blue-button"></div>
                                    <div class="blue-button"></div>
                                    <div class="blue-button"></div>
                                    <div class="blue-button"></div>
                                    <div class="blue-button"></div>
                                    <div class="blue-button"></div>
                                    <div class="blue-button"></div>
                                    <div class="blue-button"></div>
                                    <div class="blue-button"></div>
                                    <div class="blue-button"></div>
                                </div>


                                {/* 특성 정의 */}
                                <div className="info-pokemon-char">
                                    <div className="char-body char-screen screen">
                                        <div className="char-left">
                                            <div className="char-name">{pokemonData.characteristic}</div>
                                        </div>
                                        <div className="char-right">
                                            {characteristicDescriptions[pokemonData.characteristic] && (
                                                <p className="char_txt">{characteristicDescriptions[pokemonData.characteristic]}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 세부 페이지 이동 정의 */}
                                <div className="panel-row controls">
                                    <div className="prev-button" ></div>
                                    <div>
                                        <div className="now-page screen">
                                            {parseInt(serial.replace("No.", ""), 10)}   
                                        </div>
                                    </div>
                                    <div className="next-button" ></div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </section>
    )
}

export default Information;