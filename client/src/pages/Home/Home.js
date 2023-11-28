import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './Home.css';


const Home = () => {
    const [data, setData] = useState([]);

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

    // 타입 색상 정의
    const typeColors= {
        '풀': '#42bf24',
        '독': '#994dcf',
        '불꽃': '#ff612c',
        '비행': '#95c9ff',
        '물': '#2992ff',
        '벌레': '#9fa424',
        '노말': '#999999',
        '전기': '#ffdb00',
        
    }

    return(
        <section>
            <div className='main-container'>
                <div className='main-wrap'>
                    <div className='main-content'>
                        {data.map((item, index) => (
                            <Link key={index} to={`/information/${item.serial}`} className='pokemon-col'>
                                <div className='pokemon-data'>
                                    <div className='pokemon-image'>
                                        <img className='uploads-image' src={`/uploads/${item.serial}.png`} alt={item.name} />
                                    </div>
                                    
                                    <div className='pokemon-serial'>
                                        <p>{item.serial}</p>
                                    </div>

                                    <div className='pokemon-name'>
                                        <h2>{item.name}</h2>
                                    </div>
                                    
                                    <div className='pokemon-type'>
                                        <p style={{ backgroundColor: typeColors[item.type1] }} className='pokemon-type1'>{item.type1}</p>
                                        <p style={{ backgroundColor: typeColors[item.type2] }} className='pokemon-type2'>{item.type2}</p>
                                    </div>

                                    <div>
                                        {item.upload_date}
                                    </div>

                                    {/*
                                    {item.gender.split(',').map((gender, index) => (
                                        <p key={index}>{gender.trim()}</p>
                                    ))}
                                    */}
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