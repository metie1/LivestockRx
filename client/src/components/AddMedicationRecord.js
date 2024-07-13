import React, { useState } from 'react';
import axios from 'axios';

const AddMedicationRecord = ({ animalId }) => {
    const [record, setRecord] = useState({
        medication_id: '',
        date: '',
        dosage: '',
        notes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/medication-records', { ...record, animal_id: animalId });
            alert('투약 기록이 추가되었습니다.');
        } catch (error) {
            alert('투약 기록 추가 중 오류가 발생했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* 폼 필드들 */}
            <button type="submit">투약 기록 추가</button>
        </form>
    );
};