import React, { useState, useEffect, useRef } from 'react';
import '../styles/MedicationSelector.scss';

const MedicationSelector = ({ medications, onSelect, error }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMedications, setFilteredMedications] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = medications.filter(med =>
                med.품목명.toLowerCase().includes(searchTerm.toLowerCase())
            );
                setFilteredMedications(filtered);
                setIsDropdownVisible(true);
            } else {
                setFilteredMedications([]);
                setIsDropdownVisible(false);
            }
    }, [searchTerm, medications]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setSelectedMedication(null);
    };

    const handleSelectMedication = (medication) => {
        setSelectedMedication(medication);
        setSearchTerm(medication.품목명);
        setIsDropdownVisible(false);
        onSelect(medication);
    };

    const handleRemoveSelection = () => {
        setSelectedMedication(null);
        setSearchTerm('');
        onSelect(null);
    };

    return (
        <div className="medication-selector">
            <label htmlFor="medication-search">의약품 검색</label>
            <div className="search-container">
                <input
                    id="medication-search"
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="의약품 검색"
                    onFocus={() => setIsDropdownVisible(true)}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby="medication-error"
                />
                {selectedMedication && (
                    <button className="clear-button" onClick={handleRemoveSelection} aria-label="선택 취소">
                        ×
                    </button>
                )}
            </div>
            {isDropdownVisible && (
            <ul className="medication-dropdown" ref={dropdownRef} role="listbox">
                {filteredMedications.map((med) => (
                    <li 
                    key={med.id} 
                    onClick={() => handleSelectMedication(med)}
                    role="option"
                    aria-selected={selectedMedication && selectedMedication.id === med.id}
                    >
                        {med.품목명}
                    </li>
                ))}
            </ul>
            )}
            {selectedMedication && (
                <div className="selected-medication">
                <span className="medication-tag">{selectedMedication.품목명}</span>
                </div>
            )}
            {error && <span id="medication-error" className="error-message">{error}</span>}
        </div>
        );
    };

export default MedicationSelector;