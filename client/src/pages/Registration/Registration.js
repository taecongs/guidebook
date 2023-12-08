import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select'
import './Registration.css';
import { ValidateSerialNumber, ValidateName, ValidateDetail, ValidateType1, ValidateType2, ValidateHeight, ValidateCategory, VaildateWeight, VaildateCharacteristic1, VaildateCharacteristic2, ValidateImage } from '../../utils/Validation';

const Registration = () => {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [detail, setDetail] = useState("");
    const [selectedType1, setSelectedType1] = useState(null);  // Input에서 Select로 변경 -> 선택된 타입을 저장할 상태 추가
    const [selectedType2, setSelectedType2] = useState(null);  // Input에서 Select로 변경 -> 선택된 타입을 저장할 상태 추가
    const [selectOptions, setSelectOptions] = useState([]);    // Input에서 Select로 변경 -> React-Select에서 사용할 옵션을 저장하는 상태
    const [height, setHeight] = useState("");
    const [category, setCategory] = useState("");
    const [isMale, setIsMale] = useState(false);
    const [isFemale, setIsFemale] = useState(false);
    const [weight, setWeight] = useState("");
    const [characteristic1, setCharacteristic1] = useState("");
    const [characteristic2, setCharacteristic2] = useState("");
    const [image, setImage] = useState(null);
    const [typeTooltipVisible, setTypeTooltipVisible] = useState(false);
    const [charTooltipVisible, setCharTooltipVisible] = useState(false);

    /*====================================================
    // [유효성 검사] 에러 메시지 관리하기 위해 정의
    =====================================================*/
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
    // Select2 라이브러리 커스텀 정의
    =====================================================*/
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: '1px solid ' + (state.isFocused ? '#4a90e2' : '#bbb'),
            borderRadius: '0px',
            boxShadow: 'none',
            minHeight: '47.78px',
            padding: '0px',
        }),
        option: (provided, state) => ({
            ...provided,
            padding: '15px',
            cursor: 'pointer',
        }),
        menu: (provided) => ({
            ...provided,
            '& > div': {
                padding: '0px',
                // maxHeight: '250px',
                // overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#4a90e2',
                    borderRadius: '0px',
                },
            },
            borderRadius: '0px',
            margin: '0px',
        }),
    }

    /*====================================================
    // 입력 필드에서 포커스가 빠져나갈 때 호출되는 함수 정의
    =====================================================*/
    const handleBlur = async (fieldName, value) => {
        // 각 입력 필드에 대한 유효성 검사를 수행하고 에러 메시지 결과만 업데이트
        switch (fieldName){
            case 'id':
                await ValidateSerialNumber(value, setErrors);
                break;
            case 'name':
                ValidateName(value, setErrors);
            break;
            case 'detail':
                ValidateDetail(value, setErrors);
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
                console.log('에러 발생');
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
    // [시리얼] 시리얼번호 핸들러 정의
    =====================================================*/
    const handleKeyDown = (e) => {
        // 입력 된 값
        const inputValue = e.target.value;

        // 텍스트의 시작 위치
        const selectionStart = e.target.selectionStart;

        // 입력 필드의 값이 "No."로 시작하며, 선택된 텍스트의 시작 위치가 3 이하일 때 동작
        // 쉽게 말해, No. 이전으로 백스페이스 동작을 막는다.
        if(e.key === 'Backspace' && inputValue.startsWith("No.") && selectionStart <= 3){
            e.preventDefault();
        }
    }

    /*====================================================
    // [타입1] 옵션을 선택했을 때 호출 되는 함수 정의
    =====================================================*/
    const handleType1Change = (selectedOption) => {
        //  선택된 옵션을 selectedType1 상태에 저장
        setSelectedType1(selectedOption);

        // 선택된 옵션을 ValidateType1 함수에 전달하여 유효성 검사를 수행
        ValidateType1(selectedOption, setErrors);
    };

    /*====================================================
    // [타입2] 옵션을 선택했을 때 호출 되는 함수 정의
    =====================================================*/
    const handleType2Change = (selectedOption) => {
        //  선택된 옵션을 selectedType1 상태에 저장
        setSelectedType2(selectedOption);

        // 선택된 옵션을 ValidateType2 함수에 전달하여 유효성 검사를 수행
        ValidateType2(selectedOption, selectedType1, setErrors);
    };

    /*====================================================
    // [서버] Pokemon Type 정보 가져오기 위해 정의
    =====================================================*/
    useEffect(() => {
        axios
            .get('http://localhost:4001/pokemon-types')
            .then((response) => {
                const options = response.data.map((type) => ({
                    value: type.type_id,
                    label: type.type_name,
                }));
                // React-Select에서 사용할 옵션을 설정
                setSelectOptions(options);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    /*====================================================
    // [이미지] 이미지 업로드 핸들러 정의
    =====================================================*/
    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (ValidateImage(selectedImage, setErrors)) {
            setImage(selectedImage);
        }
    };

    /*====================================================
    // [폼] 데이터 전송
    =====================================================*/
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // [유효성 검사] 해당 입력필드의 유효성을 검사하고 에러 상태를 업데이트
        const isSerialValid = await ValidateSerialNumber(id, setErrors);
        const isNameValid = ValidateName(name, setErrors);
        const isDetailValid = ValidateDetail(detail, setErrors);
        const isType1Valid = ValidateType1(selectedType1 ? selectedType1.value : '', setErrors);
        const isHeightValid = ValidateHeight(height, setErrors);
        const isCategoryValid = ValidateCategory(category, setErrors);
        const isWeightValid = VaildateWeight(weight, setErrors);
        const isCharacteristic1Valid = VaildateCharacteristic1(characteristic1, setErrors);
        const isImageValid = ValidateImage(image, setErrors);

        // 모든 [유효성 검사]가 통과된 경우에만 데이터를 서버에 전송
        if (isSerialValid && isNameValid && isDetailValid && isType1Valid && isHeightValid && isCategoryValid && isWeightValid && isCharacteristic1Valid && isImageValid) {
            const formData = new FormData();

            // 폼 데이터에 필드 추가
            formData.append('serial', id);
            formData.append('name', name);
            formData.append('detail', detail);

            // type_id를 전송
            formData.append('type1', selectedType1.value);
            formData.append('type2', selectedType2.value);
            formData.append('height', height);
            formData.append('category', category);

            // 선택된 성별을 배열에 추가하기 위해 정의
            const selectedGenders = [];
            if (isMale) selectedGenders.push('남자');
            if (isFemale) selectedGenders.push('여자');
            formData.append('gender', selectedGenders.join(','));
            formData.append('weight', weight);
            formData.append('characteristic1', characteristic1);
            formData.append('characteristic2', characteristic2);
            formData.append('image', image);

            try {
                await axios.post('http://localhost:4001/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });

                alert("정상적으로 등록 되었습니다.");
                window.location.href = '/';

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
                                        <input type="text" id="id" placeholder="No.0000" value={id.startsWith("No.") ? id : `No.${id}`} onChange={(e) => setId(e.target.value)} onBlur={() => handleBlur('id', id)} onKeyDown={(e) => handleKeyDown(e)} />
                                    </div>
                                    {errors.id && <p className='error-message'>{errors.id}</p>}
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor="name" className="right-tit">이름</label>
                                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => handleBlur('name', name)} />
                                    </div>
                                    {errors.name && <p className='error-message'>{errors.name}</p>}
                                </div>
                            </div>

                            {/* 상세설명 */}
                            <div className="content-row2">
                                <div className='row2-col'>
                                    <div className='col-content'>
                                        <label htmlFor="defail">상세설명</label>
                                        <textarea id="defail" name="detail" value={detail} onChange={(e) => setDetail(e.target.value)} onBlur={() => handleBlur('detail', detail)} />
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

                                        <Select
                                                id="type1"
                                                styles={customStyles}
                                                value={selectedType1}
                                                options={selectOptions}
                                                onChange={handleType1Change}
                                                placeholder="타입을 선택해주세요."
                                        />
                                    </div>
                                    {errors.type1 && <p className='error-message'>{errors.type1}</p>}
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor="type2" className="right-tit">타입</label>

                                        <Select
                                                id="type2"
                                                styles={customStyles}
                                                value={selectedType2}
                                                options={selectOptions}
                                                onChange={handleType2Change}
                                                placeholder="타입을 선택해주세요."
                                        />
                                    </div>
                                    {errors.type2 && <p className='error-message'>{errors.type2}</p>}
                                </div>
                            </div>

                            {/* 키 & 분류 */}
                            <div className="content-row4">
                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor='height'>키</label>
                                        <input type="text" id="height" value={height} onChange={(e) => setHeight(e.target.value)} onBlur={() => handleBlur('height', height)} />
                                    </div>
                                    {errors.height && <p className='error-message'>{errors.height}</p>}
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor='category' className="right-tit">분류</label>
                                        <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} onBlur={() => handleBlur('category', category)} />
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
                                            <input type="checkbox" id="male" checked={isMale} onChange={() => setIsMale(!isMale)} />

                                            <label htmlFor="female" className="female">여자</label>
                                            <input type="checkbox" id="female" checked={isFemale} onChange={() => setIsFemale(!isFemale)} />
                                        </div>
                                    </div>
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor='weight'>몸무게</label>
                                        <input type="text" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} onBlur={() => handleBlur('weight', weight)} />
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
                                        <input type="text" id="characteristic1" value={characteristic1} onChange={(e) => setCharacteristic1(e.target.value)} onBlur={() => handleBlur('characteristic1', characteristic1)} />
                                    </div>
                                    {errors.characteristic1 && <p className='error-message'>📢 특성은 <a className='viewmore-txt2' href="https://pokemon.fandom.com/ko/wiki/%ED%8A%B9%EC%84%B1" target='_blank' rel="noreferrer"> 특성 페이지</a>를 {errors.characteristic1} </p>}
                                </div>

                                <div className='row1-col'>
                                    <div className='col-content'>
                                        <label htmlFor='characteristic2' className="right-tit">특성</label>
                                        <input type="text" id="characteristic2" value={characteristic2} onChange={(e) => setCharacteristic2(e.target.value)} onBlur={() => handleBlur('characteristic2', characteristic2)} />
                                    </div>
                                    {errors.characteristic2 && <p className='error-message'>{errors.characteristic2}</p>}
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