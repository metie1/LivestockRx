import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MedicationDetails = () => {
    const [medication, setMedication] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchMedicationDetails = async () => {
            const response = await axios.get(`/api/medications/${id}`);
            setMedication(response.data);
        };
        fetchMedicationDetails();
    }, [id]);

    if (!medication) return <div>Loading...</div>;

    return (
        <div>
            <h2>{medication.품목명}</h2>
            <p>성분명: {medication.성분명}</p>
            <p>사용방법: {medication.사용방법}</p>
            <p>사용주기: {medication.사용주기}</p>
            <p>부작용: {medication.부작용}</p>
        </div>
    );
};
