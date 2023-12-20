import {atom} from 'recoil';


// 검색 한 포켓몬 데이터 상태를 저장
export const pokemonState = atom({
    key: 'pokemonState',
    default: []
});

// 검색어 상태를 저장
export const searchTextState = atom({
    key: 'searchTextState',
    default: '',
});