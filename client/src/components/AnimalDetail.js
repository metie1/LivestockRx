import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/AnimalDetail.scss';

const AnimalDetail = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);

  useEffect(() => {
    const fetchAnimalDetail = async () => {
      try {
        const { data } = await axios.get(`/api/animals/${id}`);
        setAnimal(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAnimalDetail();
  }, [id]);

  if (!animal) return <div>Loading...</div>;




  const animalData = {
    "001": {
      image: "cow1.jpg",
      type: "소",
      weight: "500kg",
      medicineUsage: "의약품 사용 기록 없음",
      vaccinationRecord: "예방접종 1차 완료",
      birthDate: "2020-01-01",
      slaughterDate: "예정 없음",
      tag: "A123",
      gender: "암컷",
      recordDate: "2024-06-01"
    }
    // Add other animal data...
  };    
  
  const data = animalData["001"]; // Example ID




  return (
    <div>
      <div className="detail-header">
        <img id="animalImage" src={data.image} alt="Animal" />
      </div>
      <div className="detail-container">
        <table>
          <tr>
            <th>항목</th>
            <th>내용</th>
          </tr>
          <tr>
            <td>이름(시리얼 번호)</td>
            <td>{data.tag}</td>
          </tr>
          <tr>
            <td>종류</td>
            <td>{data.type}</td>
          </tr>
          <tr>
            <td>체중</td>
            <td>{data.weight}</td>
          </tr>
          <tr>
            <td>의약 사용 기록</td>
            <td>{data.medicineUsage}</td>
          </tr>
          <tr>
            <td>예방접종 기록</td>
            <td>{data.vaccinationRecord}</td>
          </tr>
          <tr>
            <td>생년월일(나이)</td>
            <td>{data.birthDate}</td>
          </tr>
          <tr>
            <td>도축일자</td>
            <td>{data.slaughterDate}</td>
          </tr>
          <tr>
            <td>개체태그</td>
            <td>{data.tag}</td>
          </tr>
          <tr>
            <td>성별</td>
            <td>{data.gender}</td>
          </tr>
          <tr>
            <td>정보 기록 일시</td>
            <td>{data.recordDate}</td>
          </tr>
        </table>
      </div>
    </div>
  );
};  

export default AnimalDetail;
