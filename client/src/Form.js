import React, { useState } from 'react';
import axios from 'axios';

const GuideAdd = () => {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [detail, setDetail] = useState("");
    const [type1, setType1] = useState("");
    const [type2, setType2] = useState("");
    const [height, setHeight] = useState("");
    const [category, setCategory] = useState("");
    const [gender, setGender] = useState("");
    const [weight, setWeight] = useState("");
    const [characteristic, setCharacteristic] = useState("");
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('serial', id);
        formData.append('name', name);
        formData.append('detail', detail);
        formData.append('type1', type1);
        formData.append('type2', type2);
        formData.append('height', height);
        formData.append('category', category);
        formData.append('gender', gender);
        formData.append('weight', weight);
        formData.append('characteristic', characteristic);
        formData.append('image', image);

        try {
            await axios.post('http://localhost:4001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // handle success
        } catch (error) {
            // handle error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Detail" value={detail} onChange={(e) => setDetail(e.target.value)} />
            <input type="text" placeholder="Type1" value={type1} onChange={(e) => setType1(e.target.value)} />
            <input type="text" placeholder="Type2" value={type2} onChange={(e) => setType2(e.target.value)} />
            <input type="text" placeholder="Height" value={height} onChange={(e) => setHeight(e.target.value)} />
            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input type="text" placeholder="Gender" value={gender} onChange={(e) => setGender(e.target.value)} />
            <input type="text" placeholder="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <input type="text" placeholder="Characteristic" value={characteristic} onChange={(e) => setCharacteristic(e.target.value)} />
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <button type="submit">Submit</button>
        </form>
    );
};

export default GuideAdd;