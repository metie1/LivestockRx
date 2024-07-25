import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MedicationInfo.scss'; // CSS 파일을 만들어 스타일을 적용하세요

function MedicationInfo() {
    const [medications, setMedications] = useState([]);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortCriteria, setSortCriteria] = useState('허가번호');
    const [sortOrder, setSortOrder] = useState('asc'); // 오름차순: 'asc', 내림차순: 'desc'
    const [searchTerm, setSearchTerm] = useState('');
    const medicationsPerPage = 20; // 한 페이지에 표시할 의약품 수
    const pageLimit = 5; // 한 번에 표시할 페이지 버튼 수

    useEffect(() => {
        console.log('MedicationInfo component mounted');
        fetchMedications();
    }, []);

    const fetchMedications = async () => {
        try {
            console.log('Fetching medications...');
            const response = await axios.get('/api/medications'); // API 엔드포인트 적절히 수정
            console.log('Medications data:', response.data);

            setMedications(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching medications:', err);
            setError(`의약품 정보를 불러오는 데 실패했습니다. 오류: ${err.message}`);
            setLoading(false);
        }
    };

    const handleMedicationSelect = (medication) => {
        console.log('Selecting medication:', medication);
        setSelectedMedication(medication);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSort = (criteria) => {
        if (sortCriteria === criteria) {
            // 같은 기준으로 다시 클릭하면 정렬 순서를 토글
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // 다른 기준으로 클릭하면 해당 기준으로 오름차순 정렬
            setSortCriteria(criteria);
            setSortOrder('asc');
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    const filteredMedications = medications.filter(med =>
        med.품목명.includes(searchTerm) || med.허가번호.includes(searchTerm) || med.업체명.includes(searchTerm)
    );

    const sortedMedications = [...filteredMedications].sort((a, b) => {
        if (sortCriteria === '허가번호') {
            return sortOrder === 'asc'
                ? a.허가번호.localeCompare(b.허가번호)
                : b.허가번호.localeCompare(a.허가번호);
        } else if (sortCriteria === '업체명') {
            return sortOrder === 'asc'
                ? a.업체명.localeCompare(b.업체명)
                : b.업체명.localeCompare(a.업체명);
        }
        return 0;
    });

    if (loading) return <div className="loading">로딩 중...</div>;
    if (error) return <div className="error">{error}</div>;
    if (medications.length === 0) return <div className="error">표시할 의약품 정보가 없습니다.</div>;

    // 현재 페이지에 해당하는 의약품 목록을 계산
    const indexOfLastMedication = currentPage * medicationsPerPage;
    const indexOfFirstMedication = indexOfLastMedication - medicationsPerPage;
    const currentMedications = sortedMedications.slice(indexOfFirstMedication, indexOfLastMedication);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(sortedMedications.length / medicationsPerPage);

    // 현재 페이지 그룹을 계산
    const currentGroup = Math.ceil(currentPage / pageLimit);
    const startPage = (currentGroup - 1) * pageLimit + 1;
    const endPage = Math.min(currentGroup * pageLimit, totalPages);

    return (
        <div className="medication-info-container">
            <div className="medication-list">
                <h2>의약품 목록</h2>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="sort-buttons">
                    <button onClick={() => handleSort('허가번호')}>
                        허가번호 {sortCriteria === '허가번호' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </button>
                    <button onClick={() => handleSort('업체명')}>
                        업체명 {sortCriteria === '업체명' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </button>
                </div>
                <ul>
                    {currentMedications.map((med) => (
                        <li 
                            key={med.id} 
                            onClick={() => handleMedicationSelect(med)}
                            className={selectedMedication && selectedMedication.id === med.id ? 'active' : ''}
                        >
                            {med.품목명}
                        </li>
                    ))}
                </ul>
                <div className="pagination">
                    {startPage > 1 && (
                        <button onClick={() => handlePageChange(startPage - 1)}>
                            &lt;
                        </button>
                    )}
                    {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                        <button 
                            key={startPage + index} 
                            onClick={() => handlePageChange(startPage + index)}
                            className={currentPage === startPage + index ? 'active' : ''}
                        >
                            {startPage + index}
                        </button>
                    ))}
                    {endPage < totalPages && (
                        <button onClick={() => handlePageChange(endPage + 1)}>
                            &gt;
                        </button>
                    )}
                </div>
            </div>
            {selectedMedication && (
                <div className="medication-details">
                    <h2>{selectedMedication.품목명}</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <h3>허가번호</h3>
                            <p>{selectedMedication.허가번호}</p>
                        </div>
                        <div className="info-item">
                            <h3>업체명</h3>
                            <p>{selectedMedication.업체명}</p>
                        </div>
                        <div className="info-item">
                            <h3>성분명</h3>
                            <p>{selectedMedication.성분명}</p>
                        </div>
                    </div>
                    <div className="info-section">
                        <h3>사용 방법 및 취급 방법</h3>
                        <p>{selectedMedication.사용방법 || '정보가 없습니다.'}</p>
                    </div>
                    <div className="info-section">
                        <h3>용법 용량</h3>
                        <p>{selectedMedication.용법용량 || '정보가 없습니다.'}</p>
                    </div>
                    <div className="info-section">
                        <h3>주의사항</h3>
                        <p>{selectedMedication.주의사항 || '정보가 없습니다.'}</p>
                    </div>
                    <div className="info-section">
                        <h3>부작용</h3>
                        <p>{selectedMedication.부작용 || '정보가 없습니다.'}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MedicationInfo;
