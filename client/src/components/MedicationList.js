import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicationList = () => {
    const [medications, setMedications] = useState([]);

    useEffect(() => {
        const fetchMedications = async () => {
            const response = await axios.get('/api/medications');
            setMedications(response.data);
        };
        fetchMedications();
    }, []);

    return (
        <div>
            <h2>의약품 목록</h2>
            <ul>
                {medications.map(med => (
                    <li key={med.id}>
                        {med.품목명} - {med.성분명}
                    </li>
                ))}
            </ul>
        </div>
    );
};