import React, { useState } from 'react';
import axios from 'axios';
import './Registration.css';


const Registration = () => {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [detail, setDetail] = useState("");
    const [type1, setType1] = useState("");
    const [type2, setType2] = useState("");
    const [height, setHeight] = useState("");
    const [category, setCategory] = useState("");
    const [isMale, setIsMale] = useState(false);
    const [isFemale, setIsFemale] = useState(false);
    const [weight, setWeight] = useState("");
    const [characteristic, setCharacteristic] = useState("");
    const [image, setImage] = useState(null);

    const [tooltipVisible, setTooltipVisible] = useState(false);

    const handleTooltipHover = (isVisible) => {
        setTooltipVisible(isVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('serial', id);
        formData.append('name', name);
        formData.append('detail', detail);
        formData.append('type1', type1);
        formData.append('type2', type2);
        formData.append('height', height);
        formData.append('category', category);

        const selectedGenders = [];
        if (isMale) selectedGenders.push('남자');
        if (isFemale) selectedGenders.push('여자');
        formData.append('gender', selectedGenders.join(','));

        formData.append('weight', weight);
        formData.append('characteristic', characteristic);
        formData.append('image', image);

        try {
            await axios.post('http://localhost:4001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <section>
            <div className="registration-container">
                <div className="registration-wrap">
                    <div className="content">
                        <h2 className="content-tit">포켓몬 등록</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="content-row1">
                                <label htmlFor="id">시리얼넘버</label>
                                <input type="text" id="id" placeholder="No.0000" value={id} onChange={(e) => setId(e.target.value)} />

                                <label htmlFor="name" className="right-tit">이름</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="content-row2">
                                <label htmlFor="defail">상세설명</label>
                                {/* <input type="text" id="defail" placeholder="Detail" value={detail} onChange={(e) => setDetail(e.target.value)} /> */}
                                <textarea id="defail" name="detail" value={detail} onChange={(e) => setDetail(e.target.value)} />
                            </div>

                            <div className="content-row3">
                                <label htmlFor="type1" className="type1" onMouseEnter={() => handleTooltipHover(true)} onMouseLeave={() => handleTooltipHover(false)}>타입
                                    <div className={`con-tooltip right ${tooltipVisible ? 'tooltip-visible' : ''}`}>
                                        <img className="type-tooltip-img" src="./image/icon_char.png" alt="type-tooltip-img" />
                                        <div className="type-tooltip">
                                            <p class="type-txt">노말, 불꽃, 물, 전기, 풀, 얼음, 격투, 독, 땅, 비행, 에스퍼, 벌레, 바위, 고스트, 드래곤, 악, 강철, 페어리</p>
                                        </div>
                                    </div>
                                </label>

                                <input type="text" id="type1" value={type1} onChange={(e) => setType1(e.target.value)} />

                                <label htmlFor="type2" className="right-tit">타입</label>
                                <input type="text" id="type2" value={type2} onChange={(e) => setType2(e.target.value)} />
                            </div>

                            <div className="content-row4">
                                <label htmlFor='height'>키</label>
                                <input type="text" id="height" value={height} onChange={(e) => setHeight(e.target.value)} />

                                <label htmlFor='category' className="right-tit">분류</label>
                                <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                            </div>

                            <div className='content-row5'>
                                <label>성별</label>
                                <div className='gender-wrap'>
                                    <label htmlFor="male" className='male'>남자</label>
                                    <input type="checkbox" id="male" checked={isMale} onChange={() => setIsMale(!isMale)} />

                                    <label htmlFor="female" className="female">여자</label>
                                    <input type="checkbox" id="female" checked={isFemale} onChange={() => setIsFemale(!isFemale)} />
                                </div>
                            </div>

                            <div className='content-row6'>
                                <label htmlFor='weight'>몸무게</label>
                                <input type="text" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} />

                                <label htmlFor='characteristic' className="right-tit">특성</label>
                                <input type="text" id="characteristic" value={characteristic} onChange={(e) => setCharacteristic(e.target.value)} />
                            </div>

                            <div className='content-row7'>
                                <label htmlFor='file'>이미지</label>
                                <input type="file" id="file" onChange={(e) => setImage(e.target.files[0])} />
                            </div>

                            <button className='btn-submit' type="submit">등록하기</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

    );
};

export default Registration;