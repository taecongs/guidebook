import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './Home.css';


const Home = () => {
    const [data, setData] = useState([]);

    /*====================================================
    // 서버 데이터 가져오기 위해 정의
    =====================================================*/
    useEffect(() => {
        fetch('http://localhost:4001/guidebook')
        .then(response => response.json())
        .then(data => {
            console.error(data);

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

    return(
        <section>
            <div className='main-container'>
                <div className='main-wrap'>
                    <div className='main-content'>
                        {data.map((item, index) => (
                            <Link key={index} to={`/information/${item.serial}`} className='pokemon-col'>
                                <div className='pokemon-data'>
                                    {/* 포켓몬 이미지 엘리먼트 정의 */}
                                    <div className='pokemon-image'>
                                        <img className='uploads-image' src={`/uploads/${item.serial}.png`} alt={item.name} />
                                    </div>
                                    
                                    {/* 포켓몬 시리얼넘버 엘리먼트 정의 */}
                                    <div className='pokemon-serial'>
                                        <p>{item.serial}</p>
                                    </div>

                                    {/* 포켓몬 이름 엘리먼트 정의  */}
                                    <div className='pokemon-name'>
                                        <h2>{item.name}</h2>
                                    </div>
                                    
                                    {/* 포켓몬 타입 엘리먼트 정의 */}
                                    <div className='pokemon-type'>
                                        <p style={{ backgroundColor: item.main_type_color}} className='pokemon-type1'>{item.main_type_name}</p>
                                        <p style={{ backgroundColor: item.sub_type_color}} className='pokemon-type2'>{item.sub_type_name}</p>
                                    </div>

                                    {/* <div>
                                        {item.upload_date}
                                    </div> */}

                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home;