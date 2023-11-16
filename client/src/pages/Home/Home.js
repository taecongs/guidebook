import { useEffect, useState } from 'react';

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
            <h1>Home</h1>

            {data.map((item, index) => (
                <div key={index}>
                    <h2>{item.name}</h2>
                    {/* <p>{item.detail}</p> */}
                    {/* {item.image.data} */}

                    {item.gender.split(',').map((gender, index) => (
                        <p key={index}>{gender.trim()}</p>
                    ))}
                </div>
            ))}
        </section>
    )
}

export default Home;