import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Information = () => {
    const {serial} = useParams();
    const [pokemonData, setPokemonData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:4001/guidebook/${serial}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('데이터 수신:', data);
                setPokemonData(data);
            })
            .catch(error => {
                console.error('데이터 가져오기 오류:', error);
            });
    }, [serial]);

    return(
        <section>
            <h1>세부 정보 - {serial}</h1>
            {pokemonData ? (
                <div>
                    <p>이름: {pokemonData.name}</p>
                    <p>타입1: {pokemonData.type1}</p>
                    <p>타입2: {pokemonData.type2}</p>
                    {/* 원하는 세부 정보를 추가로 표시 */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </section>
    )
}

export default Information;