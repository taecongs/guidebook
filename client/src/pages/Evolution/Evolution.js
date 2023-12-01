import { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './Evolution.css';

const Evolution = () => {
    const [data, setData] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [selectedPkm, setSelectedPkm] = useState(null);
    const [selectedLevels, setSelectedLevels] = useState([]);

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

    // 원형 ID(org_id) 선택 하는 함수 정의
    const orgIdChange = (orgId) => {
        console.log(orgId);

        setSelectedOrg(orgId);
        setSelectedPkm(null);
        setSelectedLevels([]);
    };

    // 포켓몬 ID(pkm_id) 선택 하는 함수 정의
    const pkmIdChange = (pkmId) => {
        console.log(pkmId);

        setSelectedPkm(pkmId);
        setSelectedLevels([]);
    };

    // 포켓몬 진화 레벨 선택하는 함수 정의
    const levelChange = (level) => {
        // 중복 체크 방지
        if(!selectedLevels.includes(level)){
            setSelectedLevels([level]);
        } else{
            setSelectedLevels([]);
        }
    };

    /*====================================================
    // 폼 데이터 전송
    =====================================================*/
    const handleRegister = async (e) => {
        e.preventDefault();

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
        
            console.log('성공적으로 전송하였습니다.');
        
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
                            <div>
                                <label>원형 ID(org_id):</label>
                                <Select value={selectedOrg} 
                                        onChange={orgIdChange} 
                                        options={data.map(item => ({ label: item.name, value: item.id }))} 
                                        placeholder="선택하세요" 
                                />
                            </div>

                            <div>
                                <label>포켓몬 ID(pkm_id):</label>
                                <Select value={selectedPkm}
                                        onChange={pkmIdChange}
                                        options={data.map(item => ({ label: item.name, value: item.id }))}
                                        placeholder="선택하세요"
                                />
                            </div>

                            <div>
                                <label>진화 레벨:</label>
                                {[1,2,3].map(level => (
                                    <label key={level}>
                                        <input type="checkbox" value={level} checked={selectedLevels.includes(level)} onChange={() => levelChange(level)} />
                                        {level}
                                    </label>
                                ))}
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