import { useState, useEffect } from "react";
import axios from 'axios';

export const InformationType = ({ evoList }) => {
    const [pokemonTypes, setPokemonTypes] = useState([]);

    /*====================================================
    // 서버 Pokemon Type 정보 가져오기 위해 정의
    =====================================================*/
    useEffect(() => {
        axios.get('http://localhost:4001/pokemon-types')
        .then(response => {
            setPokemonTypes(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, []);


    /*====================================================
    // 타입 정보를 반환하는 함수 정의
    =====================================================*/
    const getTypeInfo = (typeId) => {
        const typeInfo = pokemonTypes.find(type => type.type_id === typeId);
        // 기본값은 빈 객체
        return typeInfo || {}; 
    };


    return(
        <div className="evo-type">
            {/* 첫 번째 타입의 배경색 및 이미지를 표시 */}
            <div style={{ backgroundColor: getTypeInfo(evoList.type1).color }} className="evo-type1">
                <img className="evo-type-img" src={getTypeInfo(evoList.type1).type_image} alt={getTypeInfo(evoList.type1).type_name} />
                {getTypeInfo(evoList.type1).type_name}
            </div>
            {/* 두 번째 타입이 존재하는 경우에만 해당 타입의 배경색 및 이미지를 표시 */}
            {evoList.type2 && (
                <div style={{ backgroundColor: getTypeInfo(evoList.type2).color }} className="evo-type2">
                    <img className="evo-type-img" src={getTypeInfo(evoList.type2).type_image} alt={getTypeInfo(evoList.type2).type_name} />
                    {getTypeInfo(evoList.type2).type_name}
                </div>
            )}
        </div>
    )
}