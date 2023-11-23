import { useEffect, useState } from 'react';
import './Home.css';


const Home = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4001/guidebook')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setData(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    return(
        <section>
            <div className='main-container'>
                <div className='main-wrap'>

                    {data.map((item, index) => (
                        <div key={index} className='pokemon-data'>
                            <img src={`/uploads/${item.serial}.png`} alt={item.name} />
                            <h2>{item.name}</h2>
                            <p>{item.detail}</p>

                            {item.gender.split(',').map((gender, index) => (
                                <p key={index}>{gender.trim()}</p>
                            ))}
                        </div>
                    ))}

                </div>
            </div>
        </section>
    )
}

export default Home;