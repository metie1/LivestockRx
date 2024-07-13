import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/AnimalDetails.scss';

function AnimalDetails() {
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetchAnimalDetails();
    }, [id]);

    const fetchAnimalDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/animals/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnimal(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching animal details:', err);
            setError('개체 정보를 불러오는 데 실패했습니다.');
            setLoading(false);
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (!animal) return <div>개체 정보를 찾을 수 없습니다.</div>;

    return (
        <div className="animal-details-container">
            <h2 className="animal-details-title">개체 정보</h2>
            <div className="animal-details-card">
                <div className="animal-info">
                    <h3>기본 정보</h3>
                    <p><strong>태그 번호:</strong> {animal.tag_number}</p>
                    <p><strong>종:</strong> {animal.species === 'cow' ? '소' : '돼지'}</p>
                    <p><strong>성별:</strong> {animal.gender === 'male' ? '수컷' : '암컷'}</p>
                    <p><strong>체중:</strong> {animal.weight} kg</p>
                    <p><strong>생년월일:</strong> {new Date(animal.birth_date).toLocaleDateString()}</p>
                    {animal.slaughter_date && <p><strong>도축일자:</strong> {new Date(animal.slaughter_date).toLocaleDateString()}</p>}
                </div>
                <div className="animal-metadata">
                    <h3>메타데이터</h3>
                    <p><strong>정보 기록 일시:</strong> {new Date(animal.created_at).toLocaleString()}</p>
                    <p><strong>마지막 수정 일시:</strong> {new Date(animal.updated_at).toLocaleString()}</p>
                    <p><strong>메모:</strong> {animal.memo}</p>
                </div>
            </div>

            
            {animal.vaccinations && animal.vaccinations.length > 0 && (
                <div className="animal-records">
                    <h3>의약품 사용 기록</h3>
                    <ul className="records-list">
                        {animal.vaccinations.map(vac => (
                            <li key={vac.id} className="record-item">
                                <span className="record-name">{vac.vaccine_name}</span>
                                <span className="record-date">{new Date(vac.date).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/** 
            {animal.medicationRecords && animal.medicationRecords.length > 0 && (
                <div className="animal-records">
                    <h3>의약품 사용 기록</h3>
                    <ul className="records-list">
                        {animal.medicationRecords.map(rec => (
                            <li key={rec.id} className="record-item">
                                <span className="record-name">{rec.medication_name}</span>
                                <span className="record-date">{new Date(rec.date).toLocaleDateString()}</span>
                                <span className="record-dosage">용량: {rec.dosage}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            */}
        </div>
    );
}

export default AnimalDetails;