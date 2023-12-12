import { useState, useEffect } from "react";
import axios from 'axios';

export const Characteristic = ({ pokemonData1, pokemonData2 }) => {
    // DB에 저장되어 있는 모든 특성이 담긴 배열
    const [pokemonCharacteristic, setPokemonCharacteristic] = useState([]);

    // pokemonData1 또는 pokemonData2의 값과 일치하는 요소 저장
    const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);

/*==================================================================================================
====================================================================================================*/

    // [서버] Pokemon 특성 정보 가져오기 위해 정의
    useEffect(() => {
        axios
            .get('http://localhost:4001/pokemon-chars')
            .then((response) => {
                const options = response.data.map((type) => ({
                    value: type.char_id,
                    name: type.char_name,
                    detail: type.char_detail,
                }));
                setPokemonCharacteristic(options);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

/*==================================================================================================
====================================================================================================*/

    useEffect(() => {
        // 모든 특성이 담긴 배열에서 pokemonData1 또는 pokemonData2의 값과 일치하는 요소들을 필터링
        const selectedChars = pokemonCharacteristic.filter(char => 
            char.value === pokemonData1 || char.value === pokemonData2
        );

        setSelectedCharacteristics(selectedChars);
    }, [pokemonCharacteristic, pokemonData1, pokemonData2]);

    return(
        <div className="char-body char-screen screen">
            <div className="char-left">
                {selectedCharacteristics.map((char, index) => (
                    <div key={index} className="char-name">{char.name}</div>
                ))}
            </div>

            <div className="char-right">
                {selectedCharacteristics.map((char, index) => (
                    <p key={index} className="char_txt">{char.detail}</p>
                ))}
            </div>
        </div>
    );
}