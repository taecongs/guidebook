import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import  './Edit.css';
import { ValidateName, ValidateDetail, ValidateType1, ValidateType2, ValidateHeight, ValidateCategory, VaildateWeight, VaildateCharacteristic1, VaildateCharacteristic2} from '../../utils/Validation';

const Edit = () => {
    const {serial} = useParams();

    const [pokemonData, setPokemonData] = useState({
        id: "",
        name: "",
        detail: "",
        type1: "",
        type2: "",
        height: "",
        category: "",
        isMale: false,
        isFemale: false,
        weight: "",
        characteristic1: "",
        characteristic2: "",
        image: null,
    });

    const [typeTooltipVisible, setTypeTooltipVisible] = useState(false);
    const [charTooltipVisible, setCharTooltipVisible] = useState(false);

    // [유효성 검사] 에러 메시지 관리하기 위해 정의
    const [errors, setErrors] = useState({
        id: "",
        name: "",
        detail: "",
        type1: "",
        type2: "",
        height: "",
        category: "",
        weight: "",
        characteristic1: "",
        characteristic2: "",
        image: ""
    });

    /*====================================================
    // 서버 데이터 가져오기 위해 정의
    =====================================================*/
    useEffect(() => {
        fetch(`http://localhost:4001/guidebook/${serial}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                const genderArray = data.gender.split(',');
                const isMaleChecked = genderArray.includes('남자');
                const isFemaleChecked = genderArray.includes('여자');

                setPokemonData({
                    ...data,
                    isMale: isMaleChecked,
                    isFemale: isFemaleChecked,
                });
            })
            .catch(error => {
                console.error(error);
            })
    }, [serial]);


    const editInputChange = (e) => {
        const { name, value } = e.target;
        setPokemonData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        handleBlur(name, value);
    };

    const handleBlur = async (fieldName, value) => {
        // 각 입력 필드에 대한 유효성 검사 결과만 업데이트
        switch (fieldName){
            case 'name':
                ValidateName(value, setErrors);
            break;
            case 'detail':
                ValidateDetail(value, setErrors);
            break;
            case 'type1':
                ValidateType1(value, setErrors);
            break;
            case 'type2':
                ValidateType2(value, setErrors);
            break;
            case 'height':
                ValidateHeight(value, setErrors);
            break;
            case 'category':
                ValidateCategory(value, setErrors);
            break;
            case 'weight':
                VaildateWeight(value, setErrors);
            break;
            case 'characteristic1':
                VaildateCharacteristic1(value, setErrors);
            break;
            case 'characteristic2':
                VaildateCharacteristic2(value, setErrors);
            break;
            default:
                break;
        }
    };


    // 타입 툴팁 정의
    const typeTooltipHover = (isVisible) => {
        setTypeTooltipVisible(isVisible);
    };
            
    // 특성 툴팁 정의
    const charTooltipHover = (isVisible) => {
        setCharTooltipVisible(isVisible);
    };


    /*====================================================
    // 폼 수정 데이터 전송
    =====================================================*/
    const editHandleSubmit = async (e) => {
        e.preventDefault();

        // [유효성 검사] 해당 입력필드의 유효성을 검사하고 에러 상태를 업데이트
        // const isSerialValid = await ValidateSerialNumber(pokemonData.id, setErrors);
        const isNameValid = ValidateName(pokemonData.name, setErrors);
        const isDetailValid = ValidateDetail(pokemonData.detail, setErrors);
        const isType1Valid = ValidateType1(pokemonData.type1, setErrors);
        const isHeightValid = ValidateHeight(pokemonData.height, setErrors);
        const isCategoryValid = ValidateCategory(pokemonData.category, setErrors);
        const isWeightValid = VaildateWeight(pokemonData.weight, setErrors);
        const isCharacteristic1Valid = VaildateCharacteristic1(pokemonData.characteristic1, setErrors);
        const isCharacteristic2Valid = VaildateCharacteristic2(pokemonData.characteristic2, setErrors);

        // 모든 [유효성 검사]가 통과된 경우에만 데이터를 서버에 전송
        if (isNameValid && isDetailValid && isType1Valid && isHeightValid && isCategoryValid && isWeightValid && isCharacteristic1Valid && isCharacteristic2Valid) {
            const formData = new FormData();
            formData.append('serial', pokemonData.serial);
            formData.append('name', pokemonData.name);
            formData.append('detail', pokemonData.detail);
            formData.append('type1', pokemonData.type1);

            if (pokemonData.type2) {
                formData.append('type2', pokemonData.type2);
            }

            formData.append('height', pokemonData.height);
            formData.append('category', pokemonData.category);

            const genderArray = [];
            if (pokemonData.isMale) {
                genderArray.push('남자');
            }
            if (pokemonData.isFemale) {
                genderArray.push('여자');
            }

            formData.append('gender', genderArray.join(','));

            formData.append('weight', pokemonData.weight);
            formData.append('characteristic1', pokemonData.characteristic1);

            if (pokemonData.characteristic2) {
                formData.append('characteristic2', pokemonData.characteristic2);
            }

            formData.append('image', pokemonData.image);

            try{
                await axios.put(`http://localhost:4001/edit/${pokemonData.serial}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });
    
                alert('정상적으로 수정 되었습니다.');
                window.location.href = `/information/${pokemonData.serial}`;
            } catch(error){
                console.error(error);
            }
        }
    };


    return(
        <section>
            <div className='edit-container'>
                <div className='edit-wrap'>
                    <div className='edit-content'>
                        <h2 className='edit-content-tit'>포켓몬 수정</h2>

                        <form onSubmit={editHandleSubmit}>
                            {/* 시리얼넘버 & 이름 */}
                            <div className="content-row1">
                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor="id">시리얼넘버</label>
                                        <input type="text" id="id" className='edit-serial-disabled' placeholder="No.0000" name="serial" value={pokemonData.serial || ""}  readOnly />
                                        {/* <input type="text" id="id" placeholder="No.0000" name="serial" value={pokemonData.serial || ""} onChange={editInputChange} onBlur={() => handleBlur('id', pokemonData.id)} /> */}
                                    </div>
                                    {errors.id && <p className='error-message'>{errors.id}</p>}
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor="name" className="right-tit">이름</label>
                                        <input type="text" id="name" name="name" value={pokemonData.name || ""} onChange={editInputChange} onBlur={() => handleBlur('name', pokemonData.name)} />
                                    </div>
                                    {errors.name && <p className='error-message'>{errors.name}</p>}
                                </div>
                            </div>

                            {/* 상세설명 */}
                            <div className="content-row2">
                                <div className='row2-col'>
                                    <div className='col-content'>
                                        <label htmlFor="defail">상세설명</label>
                                        <textarea id="defail" name="detail" value={pokemonData.detail || ""} onChange={editInputChange} onBlur={() => handleBlur('detail', pokemonData.detail)}  />
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
                                                <img className="type-tooltip-img" src="/image/icon_char.png" alt="type-tooltip-img" onMouseEnter={() => typeTooltipHover(true)} onMouseLeave={() => typeTooltipHover(false)} />
                                                <div className="type-tooltip1">
                                                    <p className="type-txt">노말, 불꽃, 물, 전기, 풀, 얼음, 격투, 독, 땅, 비행, 에스퍼, 벌레, 바위, 고스트, 드래곤, 악, 강철, 페어리</p>
                                                </div>
                                            </div>
                                        </label>
                                        <input type="text" id="type1" name="type1" value={pokemonData.type1 || ""} onChange={editInputChange} onBlur={() => handleBlur('type1', pokemonData.type1)} />
                                    </div>
                                    {errors.type1 && <p className='error-message'>{errors.type1}</p>}
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor="type2" className="right-tit">타입</label>
                                        <input type="text" id="type2" name="type2" value={pokemonData.type2 || ""} onChange={editInputChange} onBlur={() => handleBlur('type2', pokemonData.type2)} />
                                    </div>
                                </div>
                                {errors.type2 && <p className='error-message'>{errors.type2}</p>}
                            </div>

                            {/* 키 & 분류 */}
                            <div className="content-row4">
                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor='height'>키</label>
                                        <input type="text" id="height" name="height" value={pokemonData.height || ""} onChange={editInputChange} onBlur={() => handleBlur('height', pokemonData.height)}  />
                                    </div>
                                    {errors.height && <p className='error-message'>{errors.height}</p>}
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor='category' className="right-tit">분류</label>
                                        <input type="text" id="category" name="category" value={pokemonData.category || ""} onChange={editInputChange} onBlur={() => handleBlur('category', pokemonData.category)} />
                                    </div>
                                    {errors.category && <p className='error-message'>{errors.category}</p>}
                                </div>
                            </div>

                            {/* 성별 & 몸무게 */}
                            <div className='content-row5'>
                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label>성별</label>
                                        <div className='gender-wrap'>
                                            <label htmlFor="male" className='male'>남자</label>
                                            <input type="checkbox" id="male" checked={pokemonData.isMale} onChange={(e) => setPokemonData(prevState => ({ ...prevState, isMale: e.target.checked }))}  />

                                            <label htmlFor="female" className="female">여자</label>
                                            <input type="checkbox" id="female" checked={pokemonData.isFemale} onChange={(e) => setPokemonData(prevState => ({ ...prevState, isFemale: e.target.checked }))} />
                                        </div>
                                    </div>
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor='weight'>몸무게</label>
                                        <input type="text" id="weight" name="weight" value={pokemonData.weight || ""} onChange={editInputChange} onBlur={() => handleBlur('weight', pokemonData.weight)} />
                                    </div>
                                    {errors.weight && <p className='error-message'>{errors.weight}</p>}
                                </div>


                            </div>

                            {/* 특성1 & 특성2 */}
                            <div className='content-row6'>
                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor='characteristic1' className="right-tit char1">특성
                                            <div className={`con-tooltip right ${charTooltipVisible ? 'tooltip-visible' : ''}`}>
                                                <img className="char-tooltip-img" src="/image/icon_char.png" alt="char-tooltip-img" onMouseEnter={() => charTooltipHover(true)} onMouseLeave={() => charTooltipHover(false)}  />
                                                <div className="type-tooltip2">
                                                    <p className="type-txt">
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
                                        <input type="text" id="characteristic1" name="characteristic1" value={pokemonData.characteristic1 || ""}  onChange={editInputChange} onBlur={() => handleBlur('characteristic1', pokemonData.characteristic1)} />
                                    </div>
                                    {errors.characteristic1 && <p className='error-message'>📢 특성은 <a className='viewmore-txt2' href="https://pokemon.fandom.com/ko/wiki/%ED%8A%B9%EC%84%B1" target='_blank' rel="noreferrer"> 특성 페이지</a>를 {errors.characteristic1} </p>}
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor='characteristic2' className="right-tit">특성</label>
                                        <input type="text" id="characteristic2" name="characteristic2" value={pokemonData.characteristic2 || ""}  onChange={editInputChange} onBlur={() => handleBlur('characteristic2', pokemonData.characteristic2)}  />
                                    </div>
                                    {errors.characteristic2 && <p className='error-message'>{errors.characteristic2}</p>}
                                </div>
                            </div>

                            {/* 이미지 */}
                            <div className='content-row7'>
                                <div className='row2-col'>
                                    <div className='col-content'>
                                        <label htmlFor='file'>이미지</label>
                                        <input type="file" id="file" name="image" onChange={editInputChange} />
                                    </div>
                                </div>
                            </div>

                            <button className='btn-submit' type="submit">수정하기</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Edit;