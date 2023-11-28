import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
            <h1>세부 정보 - {serial}</h1>
            {pokemonData ? (
                <div>
                    <p>이름: {pokemonData.name}</p>
                    <p>타입1: {pokemonData.type1}</p>
                    <p>타입2: {pokemonData.type2}</p>

                    {pokemonData.gender.split(',').map((gender, index) => (
                        <p key={index}>{gender.trim()}</p>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </section>
    )
}

export default Information;