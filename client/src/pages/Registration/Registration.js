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
    const [typeTooltipVisible, setTypeTooltipVisible] = useState(false);
    const [charTooltipVisible, setCharTooltipVisible] = useState(false);

    const [errors, setErrors] = useState({
        id: "",
        name: "",
        detail: "",
        type1: "",
        type2: "",
        height: "",
        category: "",
        weight: "",
        characteristic: "",
        image: ""
    });

    // 타입 툴팁 정의
    const typeTooltipHover = (isVisible) => {
        setTypeTooltipVisible(isVisible);
    };

    // 특성 툴팁 정의
    const charTooltipHover = (isVisible) => {
        setCharTooltipVisible(isVisible);
    };

    /*====================================================
    // [유효성 검사] 시리얼넘버 
    =====================================================*/
    const validateSerialNumber = () => {
        const serialRegex = /^No\.\d{4}$/;
        if (!id) {
            // [공통] 입력필드에 값을 입력하지 않은 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                id: "시리얼넘버를 입력해주세요.",
            }));
            return false;
        } else if (!serialRegex.test(id)) {
            // [공통] 입력 값이 존재하지만 유효성 검사를 통과하지 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                id: "시리얼넘버는 'No.0000' 형식으로 입력해주세요.",
            }));
            return false;
        } else {
            // [공통] 유효성 검사를 통과한 경우 에러 메시지 제거(입력 값 존재, 유효성 검사 통과)
            setErrors((prevErrors) => ({ ...prevErrors, id: "" }));
            return true;
        }
    };

    /*====================================================
    // [유효성 검사] 이름 
    =====================================================*/
    const validateName = () => {
        const nameRegex = /^[가-힣]+$/;
        if (!name) {
            // 이름을 입력하지 않은 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: "이름을 입력해주세요.",
            }));
            return false;
        } else if (!nameRegex.test(name)) {
            // 이름이 한글이 아닌 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: "이름은 한글로만 입력해주세요.",
            }));
            return false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
            return true;
        }
    };

    /*====================================================
    // [유효성 검사] 상세설명
    =====================================================*/
    const validateDetail = () => {
        const koreanRegex = /^[가-힣\s.]+$/;
        if (!detail) {
            // 상세설명을 입력하지 않은 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                detail: "상세설명을 입력해주세요.",
            }));
            return false;
        } else if (!koreanRegex.test(detail)) {
            // 상세설명이 한글이 아닌 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                detail: "상세설명은 한글로만 입력해주세요.",
            }));
            return false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, detail: "" }));
            return true;
        }
    };

    /*====================================================
    // [유효성 검사] 타입 1
    =====================================================*/
    const validateType1 = () => {
        const koreanRegex = /^[가-힣]+$/;
        if (!type1) {
            // 타입1을 입력하지 않은 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                type1: "타입을 입력해주세요.",
            }));
            return false;
        } else if (!koreanRegex.test(type1)) {
            // 타입1이 한글이 아닌 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                type1: "타입은 한글로만 입력해주세요.",
            }));
            return false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, type1: "" }));
            return true;
        }
    };

    /*====================================================
    // [유효성 검사] 타입 2
    =====================================================*/
    const validateType2 = () => {
        const koreanRegex = /^[가-힣]+$/;
        if (type2 && !koreanRegex.test(type2)) {
            // 입력되었을 때, 그리고 입력된 값이 한글이 아닌 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                type2: "타입은 한글로만 입력해주세요.",
            }));
            return false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, type2: "" }));
            return true;
        }
    };

    /*====================================================
    // [유효성 검사] 키
    =====================================================*/
    const validateHeight = () => {
        const numberRegex = /^[0-9]+(\.[0-9]+)?$/;
        if (!height) {
            // 키를 입력하지 않은 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                height: "키를 입력해주세요.",
            }));
            return false;
        } else if (!numberRegex.test(height)) {
            // 키가 숫자가 아니거나 소수점 형식이 아닌 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                height: "키는 숫자로만 입력해주세요.",
            }));
            return false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, height: "" }));
            return true;
        }
    }

    /*====================================================
    // [유효성 검사] 분류 
    =====================================================*/
    const validateCategory = () => {
        const koreanRegex = /^[가-힣]+$/;
        if (!category) {
            // 카테고리를 입력하지 않은 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                category: "분류를 입력해주세요.",
            }));
            return false;
        } else if (!koreanRegex.test(category)) {
            // 카테고리가 한글이 아닌 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                category: "분류는 한글로만 입력해주세요. 예시)씨앗포켓몬",
            }));
            return false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, category: "" }));
            return true;
        }
    }

    /*====================================================
    // [유효성 검사] 몸무게
    =====================================================*/
    const vaildateWeight = () => {
        const numberRegex = /^[0-9]+(\.[0-9]+)?$/;
        if (!weight) {
            // 몸무게를 입력하지 않은 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                weight: "몸무게를 입력해주세요.",
            }));
            return false;
        } else if (!numberRegex.test(weight)) {
            // 몸무게가 숫자가 아니거나 소수점 형식이 아닌 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                weight: "몸무게는 숫자로만 입력해주세요.",
            }));
            return false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, weight: "" }));
            return true;
        }
    }

    /*====================================================
    // [유효성 검사] 특성 
    =====================================================*/
    const vaildateCharacteristic = () => {
        const koreanRegex = /^[가-힣]+$/;
        if (!characteristic) {
            // 특성을 입력하지 않은 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                characteristic: "참고해서 입력해주세요.",
            }));
            return false;
        } else if (!koreanRegex.test(characteristic)) {
            // 특성이 한글이 아닌 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                characteristic: "특성은 한글로만 입력해주세요.",
            }));
            return false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, characteristic: "" }));
            return true;
        }
    }

    /*====================================================
    // [유효성 검사] 이미지
    =====================================================*/
    const validateImage = (file) => {
        if (!file) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                image: "이미지를 등록해주세요.",
            }));
            return false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
            return true;
        }
    }

    // 이미지 업로드 핸들러
    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (validateImage(selectedImage)) {
            setImage(selectedImage);
        }
    };

    /*====================================================
    // 폼 데이터 전송
    =====================================================*/
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // 유효성 검사
        const isSerialValid = validateSerialNumber();
        const isNameValid = validateName();
        const isDetailValid = validateDetail();
        const isType1Valid = validateType1();
        const isHeightValid = validateHeight();
        const isCategoryValid = validateCategory();
        const isWeightValid = vaildateWeight();
        const isCharacteristicValid = vaildateCharacteristic();
        const isImageValid = validateImage(image);
    
        if (isSerialValid && isNameValid && isDetailValid && isType1Valid && isHeightValid && isCategoryValid && isWeightValid && isCharacteristicValid && isImageValid) {
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
                    },
                });

                alert("정상적으로 등록 되었습니다.");

                // 폼 초기화
                setId('');
                setName('');
                setDetail('');
                setType1('');
                setType2('');
                setHeight('');
                setCategory('');
                setIsMale(false);
                setIsFemale(false);
                setWeight('');
                setCharacteristic('');
                setImage(null);
            } catch (error) {
                console.log(error);
            }
        }
    };


    return (
        <section>
            <div className="registration-container">
                <div className="registration-wrap">
                    <div className="registration-content">
                        <h2 className="registration-content-tit">포켓몬 등록</h2>

                        <form onSubmit={handleSubmit}>
                            {/* 시리얼넘버 & 이름 */}
                            <div className="content-row1">
                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor="id">시리얼넘버</label>
                                        <input type="text" id="id" placeholder="No.0000" value={id} onChange={(e) => setId(e.target.value)} onBlur={validateSerialNumber} />
                                    </div>
                                    {errors.id && <p className='error-message'>{errors.id}</p>}
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor="name" className="right-tit">이름</label>
                                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} onBlur={validateName} />
                                    </div>
                                    {errors.name && <p className='error-message'>{errors.name}</p>}
                                </div>
                            </div>

                            {/* 상세설명 */}
                            <div className="content-row2">
                                <div className='row2-col'>
                                    <div className='col-content'>
                                        <label htmlFor="defail">상세설명</label>
                                        <textarea id="defail" name="detail" value={detail} onChange={(e) => setDetail(e.target.value)} onBlur={validateDetail} />
                                    </div>
                                    {errors.detail && <p className='error-message'>{errors.detail}</p>}
                                </div>
                            </div>

                            {/* 타입 */}
                            <div className="content-row3">
                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor="type1" className="type1">타입
                                            <div className={`con-tooltip right ${typeTooltipVisible ? 'tooltip-visible' : ''}`}>
                                                <img className="type-tooltip-img" src="./image/icon_char.png" alt="type-tooltip-img" onMouseEnter={() => typeTooltipHover(true)} onMouseLeave={() => typeTooltipHover(false)} />
                                                <div className="type-tooltip1">
                                                    <p className="type-txt">노말, 불꽃, 물, 전기, 풀, 얼음, 격투, 독, 땅, 비행, 에스퍼, 벌레, 바위, 고스트, 드래곤, 악, 강철, 페어리</p>
                                                </div>
                                            </div>
                                        </label>
                                        <input type="text" id="type1" value={type1} onChange={(e) => setType1(e.target.value)} onBlur={validateType1} />
                                    </div>
                                    {errors.type1 && <p className='error-message'>{errors.type1}</p>}
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor="type2" className="right-tit">타입</label>
                                        <input type="text" id="type2" value={type2} onChange={(e) => setType2(e.target.value)} onBlur={validateType2} />
                                    </div>
                                    {errors.type2 && <p className='error-message'>{errors.type2}</p>}
                                </div>



                            </div>

                            {/* 키 & 분류 */}
                            <div className="content-row4">
                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor='height'>키</label>
                                        <input type="text" id="height" value={height} onChange={(e) => setHeight(e.target.value)} onBlur={validateHeight} />
                                    </div>
                                    {errors.height && <p className='error-message'>{errors.height}</p>}
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor='category' className="right-tit">분류</label>
                                        <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} onBlur={validateCategory} />
                                    </div>
                                    {errors.category && <p className='error-message'>{errors.category}</p>}
                                </div>
                            </div>

                            {/* 성별 */}
                            <div className='content-row5'>
                                <label>성별</label>
                                <div className='gender-wrap'>
                                    <label htmlFor="male" className='male'>남자</label>
                                    <input type="checkbox" id="male" checked={isMale} onChange={() => setIsMale(!isMale)} />

                                    <label htmlFor="female" className="female">여자</label>
                                    <input type="checkbox" id="female" checked={isFemale} onChange={() => setIsFemale(!isFemale)} />
                                </div>
                            </div>

                            {/* 몸무게 & 특성 */}
                            <div className='content-row6'>
                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor='weight'>몸무게</label>
                                        <input type="text" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} onBlur={vaildateWeight} />
                                    </div>
                                    {errors.weight && <p className='error-message'>{errors.weight}</p>}
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor='characteristic' className="right-tit char1">특성
                                            <div className={`con-tooltip right ${charTooltipVisible ? 'tooltip-visible' : ''}`}>
                                                <img className="char-tooltip-img" src="./image/icon_char.png" alt="char-tooltip-img" onMouseEnter={() => charTooltipHover(true)} onMouseLeave={() => charTooltipHover(false)} />
                                                <div className="type-tooltip2">
                                                     <p className="type-txt">{/*안내사항 📢 플라워베일 이후 특성은 <a className='viewmore-txt' href="https://pokemon.fandom.com/ko/wiki/%ED%8A%B9%EC%84%B1" target='_blank' rel="noreferrer"> 특성 페이지</a>를 참고해주세요. <br/> */}
                                                    악취, 잔비, 가속, 전투무장, 옹골참, 습기, 유연, 모래숨기, 정전기, 축전, 저수, 둔감, 날씨부정, 복안, 불면, 변색, 면역, 타오르는불꽃
                                                    인분, 마이페이스, 흡반, 위협, 그림자밟기, 까칠한피부, 불가사의무적, 부유, 포자, 싱크로, 클리어바디, 자연회복, 피뢰침, 하늘의은총, 쓱쓱, 엽록소, 발광, 트레이스
                                                    천하장사, 독가시, 정신력, 마그마의무장, 수의베일, 자력, 방음, 젖은접시, 모래날림, 프레셔, 두꺼운지방, 일찍기상, 불꽃몸, 도주, 날카로운눈, 괴력집게, 픽업,
                                                    게으름, 의욕, 헤롱헤롱바디, 플러스, 마이너스, 기분파, 점착, 탈피, 근성, 이상한비늘, 해감액, 심록, 맹화, 급류, 벌레의알림, 돌머리, 가뭄, 개미지옥, 의기양양,
                                                    하얀연기, 순수한힘, 조가비갑옷, 에어록, 갈지자걸음, 전기엔진, 투쟁심, 불굴의마음, 눈숨기, 먹보, 분노의강철, 곡예, 내열, 단순, 건조피부, 다운로드, 철주먹,
                                                    포이즌힐, 적응력, 스킬링크, 촉촉바디, 선파워, 속보, 노말스킨, 스나이퍼, 매직가드, 노가드, 시간벌기, 테크니션, 리프가드, 서투름, 틀깨기, 대운, 유폭, 위험예지,
                                                    예지몽, 천진, 색안경, 필터, 슬로스타트, 배짱, 마중물, 아이스바디, 하드록, 눈퍼뜨리기, 꿀모으기, 통찰, 이판사판, 멀티타입, 플라워기프트, 나이트메어, 나쁜손버릇,
                                                    우격다짐, 심술꾸러기, 긴장감, 오기, 무기력, 저주받은바디, 치유의마음, 프렌드가드, 깨어진갑옷, 헤비메탈, 라이트메탈, 멀티스케일, 독폭주, 열폭주, 수확, 텔레파시,
                                                    변덕쟁이, 방진, 독수, 재생력, 부풀린가슴, 모래헤치기, 미라클스킨, 애널라이즈, 일루전, 괴짜, 틈새포작, 미라, 자기과신, 정의의마음, 주눅, 매직미러, 초식, 짓궂은마음,
                                                    모래의힘, 철가시, 달마모드, 승리의별, 터보블레이즈, 테라볼티지, 아로마베일, 플라워베일</p>
                                                </div>
                                            </div>
                                        </label>
                                        <input type="text" id="characteristic" value={characteristic} onChange={(e) => setCharacteristic(e.target.value)} onBlur={vaildateCharacteristic} />
                                    </div>
                                    {errors.characteristic && <p className='error-message'>📢 특성은 <a className='viewmore-txt2' href="https://pokemon.fandom.com/ko/wiki/%ED%8A%B9%EC%84%B1" target='_blank' rel="noreferrer"> 특성 페이지</a>를 {errors.characteristic} </p>}
                                </div>
                            </div>

                            {/* 이미지 */}
                            <div className='content-row7'>
                                <div className='row2-col'>
                                    <div className='col-content'>
                                        <label htmlFor='file'>이미지</label>
                                        <input type="file" id="file" onChange={handleImageChange} />
                                    </div>
                                    {errors.image && <p className='error-message'>{errors.image}</p>}
                                </div>
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