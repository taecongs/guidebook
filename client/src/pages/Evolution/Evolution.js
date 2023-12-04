import { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './Evolution.css';

const Evolution = () => {
    const [data, setData] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [selectedPkm, setSelectedPkm] = useState(null);
    const [selectedLevels, setSelectedLevels] = useState([]);

    const [evoErrors, setEvoErrors] = useState({
        org: '',
        pkm: '',
        levels: "",
    })

    /*====================================================
    // Select2 라이브러리 커스텀 정의
    =====================================================*/
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: '1px solid ' + (state.isFocused ? '#4a90e2' : '#bbb'),
            borderRadius: '0px',
            boxShadow: 'none',
            minHeight: '47px',
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
    // 서버 데이터 가져오기 위해 정의
    =====================================================*/
    useEffect(() => {
        fetch('http://localhost:4001/guidebook')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const sortedData = data.sort((a, b) => {
                // 'No.' 이후의 숫자를 추출하여 비교 (숫자로 변환하여 비교)
                const serialA = parseInt(a.serial.split('.')[1]);
                const serialB = parseInt(b.serial.split('.')[1]);
                return serialA - serialB;
            });

            setData(sortedData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    /*====================================================
    // 원형 포켓몬(org_id) 선택 하는 함수 정의
    =====================================================*/
    const orgIdChange = (orgId) => {
        setSelectedOrg(orgId);
        
        // [유효성 검사] 옵션을 선택하는 경우 기존 에러 메시지 초기화
        setEvoErrors((prevErrors) => ({ ...prevErrors, org: "" }));
        setSelectedPkm(null);
        setSelectedLevels([]);
    };

    /*====================================================
    // 포켓몬 ID(pkm_id) 선택 하는 함수 정의
    =====================================================*/
    const pkmIdChange = (pkmId) => {
        setSelectedPkm(pkmId);

        // [유효성 검사] 옵션을 선택하는 경우 기존 에러 메시지 초기화
        setEvoErrors((prevErrors) => ({ ...prevErrors, pkm: "" }));
        setSelectedLevels([]);
    };

    /*====================================================
    // 포켓몬 진화 레벨 선택하는 함수 정의
    =====================================================*/
    const levelChange = (level) => {
        // 중복 체크 방지
        if(!selectedLevels.includes(level)){
            setSelectedLevels([level]);
        } else{
            setSelectedLevels([]);
        }
        // [유효성 검사] 옵션을 선택하는 경우 기존 에러 메시지 초기화
        setEvoErrors((prevErrors) => ({ ...prevErrors, levels: "" }));
    };

    /*====================================================
    // 폼 데이터 전송
    =====================================================*/
    const handleRegister = async (e) => {
        e.preventDefault();

        // [유효성 검사] 원형 포켓몬(org_id)
        if (!selectedOrg) {
            setEvoErrors((prevErrors) => ({
                ...prevErrors,
                org: "원형 포켓몬을 선택해주세요.",
            }));
            return;
        } else {
            setEvoErrors((prevErrors) => ({ ...prevErrors, org: "" }));
        }

        // [유효성 검사] 진화 포켓몬(pkm_id)
        if (!selectedPkm) {
            setEvoErrors((prevErrors) => ({
                ...prevErrors,
                pkm: "진화 포켓몬을 선택해주세요.",
            }));
            return;
        }

        // [유효성 검사] 진화 단계(evolution_level)
        if(selectedLevels.length === 0){
            setEvoErrors((prevErrors) => ({
                ...prevErrors,
                levels: "진화 단계를 선택해주세요.",
            }));
            return;
        }

        const formData = new FormData();
        formData.append('org_id', selectedOrg.value);
        formData.append('pkm_id', selectedPkm.value);
        formData.append('level', selectedLevels);

        try {
            await axios.post('http://localhost:4001/evolution', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
            alert("정상적으로 등록 되었습니다.");

            window.location.href = '/';
        
        } catch (error) {
            console.error(error);
        }
    }

    return(
        <section>
            <div className="evolution-container">
                <div className="evolution-wrap">
                    <div className="evolution-content">
                        <h2 className="evolution-content-tit">포켓몬 진화</h2>

                        <form onSubmit={handleRegister}>
                            {/* 원형 포켓몬 엘리먼트 정의 */}
                            <div className='evo-content-row1'>
                                <div className='evo-row1-col'>
                                    <div className='evo-col-content'>
                                        <label>원형 포켓몬</label>
                                        <Select styles={customStyles} value={selectedOrg}
                                                onChange={orgIdChange} 
                                                options={data.map(item => ({ label: item.name, value: item.id }))} 
                                                placeholder="진화 전 가장 첫 번째의 포켓몬을 선택해주세요." 
                                        />
                                    </div>
                                    <p className="evo-error-message">{evoErrors.org}</p>
                                </div>
                            </div>

                            {/* 진화 포켓몬 엘리먼트 정의  */}
                            <div className='evo-content-row2'>
                                <div className='evo-row2-col'>
                                    <div className='evo-col-content'>
                                        <label>진화 포켓몬</label>
                                        <Select styles={customStyles} value={selectedPkm}
                                                onChange={pkmIdChange}
                                                options={data.map(item => ({ label: item.name, value: item.id }))}
                                                placeholder="원형 포켓몬에서 선택하신 포켓몬의 다음 진화를 선택해주세요."
                                        />
                                    </div>
                                    <p className="evo-error-message">{evoErrors.pkm}</p>
                                </div>
                            </div>

                            {/* 진화 단계 엘리먼트 정의 */}
                            <div className='evo-content-row3'>
                                <div className='evo-row3-col'>
                                    <div className='evo-col-content'>
                                        <label>진화 단계</label>
                                        <div className='evo-level-check'>
                                            {[1,2,3].map(level => (
                                                <label key={level}>
                                                    {level}단계
                                                    <input className='evo' type="checkbox" value={level} checked={selectedLevels.includes(level)} onChange={() => levelChange(level)} />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="evo-error-message">{evoErrors.levels}</p>
                                </div>
                            </div>

                            {/* 설명 정의 */}
                            <div className="terms_area">
                                <div className='terms_row1'>
                                    <h2 className='terms_title'># 원형 포켓몬</h2>
                                    <p>원형 포켓몬은 진화 전 가장 첫 번째의 포켓몬을 선택해주시면 됩니다.</p>
                                    <p>📢 이상해씨의 진화 정보를 등록하시는 경우</p>
                                    <p>- 이상해씨<span className='terms_line'>|</span>이상해풀<span className='terms_line'>|</span>이상해꽃 중 <b className='terms_b'>이상해씨</b>를 선택해 주시면 됩니다.</p>
                                </div>
    
                                <div className='terms_row2'>
                                    <h2 className='terms_title'># 진화 포켓몬</h2>
                                    <p>진화 포켓몬은 원형 포켓몬에서 선택하신 포켓몬의 다음 진화를 선택해주시면 됩니다.</p>
                                    <p>- 최초로 등록하시는 경우라면, 반드시 <b className='terms_red'>첫 번째 진화 단계인(이상해씨)를 먼저 등록</b>해주셔야 합니다.</p>
                                    <p>📢 이상해씨의 진화 정보를 등록하시는 경우</p>
                                    <p>- 이상해씨<span className='terms_line'>|</span>이상해풀<span className='terms_line'>|</span>이상해꽃 중 첫 번째 진화 단계를 등록하셨다면 <b className='terms_b'>이상해풀</b>을 선택해 주시면 됩니다.</p>
                                </div>
    
                                <div className='terms_row2'>
                                    <h2 className='terms_title'># 진화 단계</h2>
                                    <p>원형 포켓몬과 진화 포켓몬을 선택하셨다면 입력하신 포켓몬의 진화 단계를 선택해주시면 됩니다.</p>
                                    <p>📢 이상해씨의 진화 정보를 등록하시는 경우</p>
                                    <p>- 이상해씨(1단계)<span className='terms_line'>|</span>이상해풀(2단계)<span className='terms_line'>|</span>이상해꽃(3단계) 중 <b className='terms_b'>이상해씨</b>를 선택하신 경우는 1단계를 선택해 주시면 됩니다.</p>
                                </div>
                            </div>

                            <button className='btn-submit' type="submit">등록하기</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Evolution;