import React from 'react';

export const Search = ({ searchText, handleSearchChange, handleSearch }) => {
    console.log(searchText)
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
                    <input
                        type="text"
                        placeholder="포켓몬 이름 또는 설명, 특성 키워드를 입력해주세요."
                        className='pokemon-search'
                        value={searchText}
                        onChange={handleSearchChange}
                        onKeyPress={(event) => event.key === 'Enter' && handleSearch()}
                    />

                    <button className='search-button' onClick={handleSearch}></button>
                </div>
            </div>
        </div>
    );
}