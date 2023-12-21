import {atom} from 'recoil';


// 검색한 포켓몬 데이터를 저장한다.
export const pokemonState = atom({
    key: 'pokemonState',
    default: []
});

// 검색어를 저장한다.
export const searchTextState = atom({
    key: 'searchTextState',
    default: ''
});

// 검색 결과가 없는 경우를 나타낸다.
export const noResultsState = atom({
    key: 'noResultsState',
    default: false
})