import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './Information.css';

const Information = () => {
    const {serial} = useParams();
    const [pokemonData, setPokemonData] = useState(null);

    useEffect(() => {
        // 해당 serial을 사용하여 데이터를 가져오는 API 호출
        fetch(`http://localhost:4001/guidebook/${serial}`)
            .then(response => response.json())
            .then(data => {
                // 성공적으로 데이터를 가져온 경우 상태 업데이트
                setPokemonData(data);
                console.error(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [serial]);

    return(
        <section>
            {/* <h1>세부 정보 - {serial}</h1> */}
            {pokemonData ? (
                <div className="info-container">
                    <div className="info-wrap">
                        <div className="pokemon-depth">
                            <div className="panel left-panel">
                                <div className="info-pokemon-name screen">
                                    <p>{pokemonData.name}</p>
                                    <span className="info-pokemon-serial">{serial}</span>
                                </div>

                                <div className="info-pokemon-image">
                                    <img className="info-image-size" src={`/uploads/${pokemonData.serial}.png`} alt={pokemonData.name} />
                                </div>

                                <div className="info-sprite-controls">
                                    <div className="info-pokemon-gender">
                                        {pokemonData.gender.split(',').map((gender, index) => (
                                            <div className="gender-icon" key={index}>{gender.trim()}</div>
                                        ))}
                                    </div>

                                </div>

                                <div className="info-pokemon-detail screen">
                                    <p>{pokemonData.detail}</p>
                                </div>
                            </div>

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