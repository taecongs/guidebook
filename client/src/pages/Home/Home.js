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
                        <Link key={index} to={`/information/${item.serial}`}>
                            <div className='pokemon-data'>
                                <img src={`/uploads/${item.serial}.png`} alt={item.name} />
                                <div className='pokemon-serial'>
                                    <p>{item.serial}</p>
                                </div>

                                <div className='pokemon-name'>
                                    <h2>{item.name}</h2>
                                </div>
                                
                                <div className='pokemon-type'>
                                    <p>{item.type1}</p>
                                    <p>{item.type2}</p>
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
        </section>
    )
}

export default Home;