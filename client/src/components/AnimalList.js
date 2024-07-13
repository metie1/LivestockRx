import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/AnimalList.scss';

const AnimalList = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newAnimal, setNewAnimal] = useState({
        tag_number: '',
        species: 'cow',
        gender: 'male',
        birth_date: '',
        weight: '',
    });

    useEffect(() => {
        fetchAnimals();
    }, []);

    const fetchAnimals = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/my-animals', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnimals(response.data);
            setLoading(false);
        } catch (err) {
            setError('개체 목록을 불러오는 데 실패했습니다.');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setNewAnimal({ ...newAnimal, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/animals', newAnimal, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setNewAnimal({
                tag_number: '',
                species: 'cow',
                gender: 'male',
                birth_date: '',
                weight: '',
            });
            fetchAnimals();
        } catch (err) {
            console.error('Error adding animal:', err);
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="animal-list">
            <h2>개체 목록</h2>
            <table>
                <thead>
                    <tr>
                        <th>태그 번호</th>
                        <th>종</th>
                        <th>성별</th>
                        <th>상세 정보</th>
                    </tr>
                </thead>
                <tbody>
                    {animals.map(animal => (
                        <tr key={animal.id}>
                            <td>{animal.tag_number}</td>
                            <td>{animal.species === 'cow' ? '소' : '돼지'}</td>
                            <td>{animal.gender === 'male' ? '수컷' : '암컷'}</td>
                            <td>
                                <Link to={`/animals/${animal.id}`}>상세 보기</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>새 개체 추가</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="tag_number"
                    placeholder="태그 번호"
                    value={newAnimal.tag_number}
                    onChange={handleInputChange}
                    required
                />
                <select name="species" value={newAnimal.species} onChange={handleInputChange} required>
                    <option value="cow">소</option>
                    <option value="pig">돼지</option>
                </select>
                <select name="gender" value={newAnimal.gender} onChange={handleInputChange} required>
                    <option value="male">수컷</option>
                    <option value="female">암컷</option>
                </select>
                <input
                    type="date"
                    name="birth_date"
                    value={newAnimal.birth_date}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="weight"
                    placeholder="체중 (kg)"
                    value={newAnimal.weight}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">추가</button>
            </form>
        </div>
    );
};

export default AnimalList;
