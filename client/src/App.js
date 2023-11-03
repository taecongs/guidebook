import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/guidebook')
    .then(response => response.json())
    .then(data => {
      console.log(data);
        setData(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  }, []);

  return (
    <div className="App">
            {data.map((item, index) => (
                <div key={index}>
                    {/* <h2>{item.name}</h2> */}
                    {/* <p>{item.detail}</p> */}
                    {/* {item.image.data} */}
                </div>
            ))}
    </div>
  );
}

export default App;
