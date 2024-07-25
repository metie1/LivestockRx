// const { Animal, Vaccination, MedicationRecord } = require('../models');
const { Medication } = require('../models');
const { Sequelize, Op } = require('sequelize');

/*
exports.submitHealthCheck = async (req, res) => {
    try {
        const { animalType, tag, symptoms } = req.body;

        // 개체 정보 조회
        const animal = await Animal.findOne({
            where: { tag_number: tag, species: animalType === 'cow' ? 'cow' : 'pig' },
            include: [
                {
                    model: Vaccination,
                    order: [['date', 'DESC']],
                    limit: 1,
                },
                {
                    model: MedicationRecord,
                    order: [['date', 'DESC']],
                    limit: 1,
                }
            ]
        });

        if (!animal) {
            return res.status(404).json({ message: '개체를 찾을 수 없습니다.' });
        }

        // 증상 정보 저장 (옵션)
        // await Symptom.create({ animal_id: animal.id, ...symptoms });

        // 응답 데이터 구성
        const response = {
            tag: animal.tag_number,
            lastVaccinationDate: animal.Vaccinations[0]?.date || '백신 기록 없음',
            lastMedication: animal.MedicationRecords[0]?.medication_name || '투약 기록 없음',
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Health check submission error:', error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
};
*/

// 수정버전
const diseaseSymptoms = {
    cow: {
        // '가성우역': ['fever', 'nasalDischarge', 'salivation', 'oralUlcer', 'diarrhea', 'dehydration', 'weightLoss'],
        '소 기종저': ['suddenDeath', 'fever', 'staggering', 'bloodyDischarge', 'anorexia', 'weakness', 'edema'],
        // '네오스포라병': ['abortion', 'infertility', 'ataxia', 'paralysis', 'muscleTremors', 'growthDelay', 'diarrhea', 'pneumonia'],
        '대장균증': ['diarrhea', 'dehydration', 'anorexia', 'weakness', 'weightLoss', 'fever'],
        '럼피스킨병': ['skinNodules', 'fever', 'lymphadenopathy', 'salivation', 'anorexia', 'weightLoss', 'ulcers', 'respiratoryDistress'],
        '렙토스피라병': ['fever', 'jaundice', 'hematuria', 'abortion', 'anorexia', 'weakness', 'weightLoss', 'musclePain', 'kidneyDamage', 'liverDamage'],
        // '리프트계곡열': ['fever', 'anorexia', 'abortion', 'weakness', 'weightLoss', 'jaundice', 'ascites'],
        '마이코플라즈마폐렴': ['cough', 'nasalDischarge', 'respiratoryDistress', 'weightLoss', 'fever', 'anorexia', 'growthDelay'],
        // '보툴리즘': ['anorexia', 'weakness', 'musclePalsy', 'dysphagia', 'salivation', 'tonguePalsy', 'recumbency', 'respiratoryDistress'],
        '브루셀라병': ['abortion', 'infertility', 'arthritis', 'orchitis', 'mastitis', 'weightLoss', 'fever', 'anorexia'],
        // '블루텅': ['fever', 'salivation', 'oralEdema', 'cyanosis', 'ulcers', 'respiratoryDistress', 'lameness', 'weightLoss', 'anorexia', 'abortion'],
        '소결핵병': ['chronicCough', 'weightLoss', 'fatigue', 'intermittentFever', 'lymphadenopathy', 'respiratoryDistress', 'diarrhea', 'decreasedMilkProduction'],
        '소로타바이러스감염증': ['severeDiarrhea', 'dehydration', 'anorexia', 'weightLoss', 'decreasedMilkIntake', 'weakness', 'abdominalPain', 'increasedVocalization'],
        '소바이러스성설사': ['fever', 'anorexia', 'diarrhea', 'mucosalUlcers', 'cough', 'nasalDischarge', 'abortion', 'congenitalDefects', 'weightLoss', 'growthDelay', 'immunosuppression'],
        '소전염성비기관염': ['fever', 'anorexia', 'mucosalInflammation', 'nasalDischarge', 'cough', 'respiratoryDistress', 'lacrimation', 'conjunctivitis', 'abortion'],
        // '소츄잔병': ['fever', 'lymphadenopathy', 'respiratoryDistress', 'cough', 'anorexia', 'weightLoss', 'mucoidDischarge', 'weakness', 'diarrhea'],
        '소캄필로박터증': ['abortion', 'infertility', 'fetalDeath', 'prolongedGestation', 'fever', 'anorexia', 'diarrhea', 'abdominalPain'],
        '소콕시듐증': ['diarrhea', 'dehydration', 'anorexia', 'weightLoss', 'abdominalPain', 'abdominalDistension', 'weakness', 'lethargy', 'hemorrhage']
        // ... 다른 소 질병들 추가
    },
    pig: {
        '돼지 호흡기 질병 복합체': ['cough', 'sneezing', 'nasalDischarge', 'respiratoryDistress', 'weightLoss', 'fever', 'anorexia'],
        '구제역': ['fever', 'anorexia', 'salivation', 'vesicles'],
        '돼지 세균성 폐렴': ['cough', 'respiratoryDistress', 'fever', 'nasalDischarge', 'anorexia', 'weightLoss'],
        '돼지 이질': ['bloodyStool', 'mucoidStool', 'anorexia', 'weightLoss', 'dehydration', 'fever'],
        '돼지로타바이러스': ['diarrhea', 'dehydration', 'vomiting'],
        // '돼지수포병': ['fever', 'vesicles'],
        '써코바이러스': ['respiratoryDistress', 'chronicPneumonia', 'diarrhea', 'gastricUlcers'],
        '돼지유행성설사': ['diarrhea', 'anorexia', 'vomiting', 'dehydration'],
        '돼지적리': ['diarrhea', 'anorexia', 'abdominalPain', 'dehydration'],
        '돼지파보바이러스감염증': ['abortion', 'stillbirth', 'mummification', 'weakPiglets', 'immuneResponse'],
        '돼지흉막폐렴': ['fever', 'lethargy', 'anorexia', 'depression', 'respiratoryDistress', 'cough', 'arthritis', 'endocarditis', 'edema'],
        '레오바이러스감염증': ['fever', 'lethargy', 'anorexia', 'depression', 'respiratoryDistress', 'cough', 'arthritis', 'endocarditis', 'edema'],
        '살모넬라균증': ['septicemia', 'diarrhea'],
        // '돼지 폐렴유사균 감염': ['chronicCough', 'respiratoryDistress', 'growthDelay', 'weightLoss', 'anorexia', 'fever', 'nasalDischarge'],
        '돼지 유행성 폐렴': ['respiratoryDistress', 'growthDelay', 'weightLoss', 'anorexia', 'nasalDischarge', 'fever'],
        '돼지 연쇄상구균증': ['fever', 'arthritis', 'lameness', 'meningitis', 'abscesses', 'ulcers', 'anorexia', 'growthDelay', 'respiratoryDistress'],
        // '돼지 편도염': ['fever', 'anorexia', 'salivation', 'oralPain', 'dysphagia', 'neckSwelling', 'cough', 'respiratoryDistress'],
        // '돼지 흑사병': ['fever', 'anorexia', 'arthritis', 'skinSpots', 'suddenDeath', 'endocarditis'],
        '돼지 콜레라': ['fever', 'anorexia', 'vomiting', 'diarrhea', 'skinSpots', 'respiratoryDistress', 'convulsions', 'staggering', 'nasalDischarge', 'abortion'],
        '돼지 살모넬라증': ['fever', 'diarrhea', 'dehydration', 'anorexia', 'weakness', 'skinSpots', 'growthDelay', 'weightLoss'],
        '돼지 다발성 장염': ['diarrhea', 'weightLoss', 'growthDelay', 'anorexia', 'abdominalDistension', 'bloodyStools']
        // ... 다른 돼지 질병들 추가
    }
};

const diseaseTreatments = {
    cow: {
        // '가성우역': ['광범위 항생제', 'Peste des petits ruminants 백신'], // 수정 필요
        '소 기종저': ['페니실린지프로카인', '기종저 약독생균백신'],       // 일단 ok
        // '네오스포라병': [],    
        '대장균증': ['옥시테트라사이클린'],        // 일단 ok, 마미젯 연고(수출용)는 성분을 검색하다보니 다른 의약품이 나올 수 있음
        '럼피스킨병': ['lumpy'],     // ok
        '렙토스피라병': ['약제감수성및내성미생물검사시약[2](AST Disc Oxytetracycline 30μg(OT30))'], // 일단 ok
        // '리프트계곡열': ['Supportive Therapy'], 치료법은 없으며 증상완화를 위하여 대증요법을 이용함.
        '마이코플라즈마폐렴': ['저위험성동물전염병유전검사용시약[2](PowerChek Mycoplasma bovis Real-time PCR Kit)',
            '고위험성동물전염병유전검사용시약[3](PowerChekTM Mycoplasma gallisepticum / Mycoplasma synoviae Real-time PCR Kit)',
            '저위험성동물전염병유전검사용시약[2](PowerChekTM Mycoplasma hyopneumoniae Real-time PCR Kit)'
        ], //  여러 항생제가 흔히 이 감염을 퇴치하는 데 실패했고, 식용동물에서 마이코플라즈마병은 크나큰 경제적인 손실을 초래
        // '보툴리즘': ['Antitoxin Serum'],
        '브루셀라병': ['Brucella'],         // 일단 ok
        // '블루텅': ['Vaccination'], 
        '소결핵병': ['우결핵'],             // ok 키트만 추천, 소 결핵 양성우는 실험적인 목적으로 치료할 수는 있으나 치료하지 않고 살처분함
        '소로타바이러스감염증': ['보비샷 로코', '칼프가드', '프로백 로코 주'],                   // ok
        '소바이러스성설사': ['힘백 소 브이아이 백신(HIMMVAC BOVINE V.I. VACCINE)', 'IBR, BVD 불활화혼합백신', '보비샷 리드'], // ok
        '소전염성비기관염': ['인포스 3' , '대성 IBR-BP 겔 캐틀백', 'IBR, BVD 불활화혼합백신'],   // ok
        // '소츄잔병': ['Supportive Therapy'],                          // 백신없음
        '소캄필로박터증': ['CFV'],                                      // 일단 ok
        '소콕시듐증': ['살콕신', '성원 모네란', 'monensin']             // ok
    },
    pig: {
        '돼지 호흡기 질병 복합체': ['세프퀸주 25mg'],             // 일단 ok
        '구제역': ['구제역'],                                     // ok
        '돼지 세균성 폐렴': ['세프티오퍼 염산염'],                // ok
        // '돼지 이질': ['Tiamulin', 'Lincomycin', 'Tylosin'],      
        '돼지로타바이러스': ['로타바이러스'],                     // ok
        // '돼지수포병': ['Benzalkonium Chloride Disinfectant'], 특별한 치료 방법X, 구제역증상과 유사, 진단이 어렵움 대부분의 국가는 살처분 정책펼침
        '써코바이러스': ['돼지 써코바이러스 항원'],               // ok
        '돼지유행성설사': ['유행성설사'],                         // ok
        '돼지적리': ['티아물린'],                                 // ok
        '돼지파보바이러스감염증': ['힘백 돼지파보 재조합 불활화백신', '돼지단독+파보바이러스'],  // ok
        '돼지흉막폐렴': ['펜플렉스-에스엠 주', '흉막폐렴'],       // ok
        '레오바이러스감염증': ['포울샷 레오 S-1133'],             // 일단 ok
        '살모넬라균증': ['덱스페론-G 주', '겐타산 20', '진우겐타마이신', '슈퍼티아 3090'],      // ok
        // '돼지 폐렴유사균 감염': ['Tilmicosin', 'Doxycycline', 'Enrofloxacin', 'Tulathromycin', 'Florfenicol', 'Lincomycin'],
        '돼지 유행성 폐렴': ['마이코플라즈마폐렴'],                // ok
        '돼지 연쇄상구균증': ['올락', '힘백 돈호방-지엠에스'],     // 일단 ok
        // '돼지 편도염': ['Penicillin', 'Amoxicillin', 'Ceftiofur', 'Oxytetracycline', 'Enrofloxacin', 'Flunixin meglumine'],
        // '돼지 흑사병': ['Penicillin'],
        '돼지 콜레라': ['돼지열병'],                               // ok
        '돼지 살모넬라증': ['클로람페니콜+타이로신+프레드니솔론'],  // 일단 ok
        '돼지 다발성 장염': ['돼지 증식성 회장염']                 // ok
    }
};

exports.diagnose = async (req, res) => {
    try {
        const { animalType, symptoms } = req.body;

        if (!animalType || !symptoms || !Array.isArray(symptoms)) {
            return res.status(400).json({ message: '잘못된 입력 형식입니다.' });
        }
        
        if (!['cow', 'pig'].includes(animalType)) {
            return res.status(400).json({ message: '지원되지 않는 동물 유형입니다.' });
        }
        
        /*
        const possibleDiseases = Object.entries(diseaseSymptoms[animalType])
            .filter(([_, diseaseSymptoms]) => 
                symptoms.some(symptom => diseaseSymptoms.includes(symptom))
            )
            .map(([disease, _]) => disease);
    
        const treatmentIngredients = possibleDiseases.flatMap(disease => 
            diseaseTreatments[animalType][disease] || []
        );
        */

        // 수정버전
        const possibleDiseases = Object.entries(diseaseSymptoms[animalType])

        .map(([disease, diseaseSymptoms]) => {
            const matchedSymptoms = symptoms.filter(symptom => diseaseSymptoms.includes(symptom));
            const matchPercentage = diseaseSymptoms.length > 0
            ? (matchedSymptoms.length / diseaseSymptoms.length) * 100
            : 0;
            return { disease, matchPercentage };
        })
        .filter(({ matchPercentage }) => matchPercentage > 0)
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

        const topDisease = possibleDiseases[0]; // 가장 일치도가 높은 질병

        let medications = [];
        if (topDisease) {
            const treatmentIngredients = diseaseTreatments[animalType][topDisease.disease] || [];

            medications = await Medication.findAll({
                where: {
                [Op.or]: [
                    {
                    성분명: {
                        [Op.or]: treatmentIngredients.map(ingredient => ({
                        [Op.like]: `%${ingredient}%`
                        }))
                    }
                    },
                    {
                    품목명: {
                        [Op.or]: treatmentIngredients.map(ingredient => ({
                        [Op.like]: `%${ingredient}%`
                        }))
                    }
                    }
                ]
                },
                order: [['허가일', 'DESC']], // 허가일 기준 내림차순 정렬
                limit: 5 // 상위 5개 의약품만 반환
            });
        }

        res.json({ 
            diseases: possibleDiseases.slice(0, 3), // 상위 3개 질병만 반환
            topDisease: topDisease,
            medications: medications.map(med => ({
                품목명: med.품목명,
                성분명: med.성분명,
                업체명: med.업체명,
                허가번호: med.허가번호,
                허가일: med.허가일
            }))
        });
    } catch (error) {
        console.error('Error in diagnosis:', error);

        res.status(500).json({ message: '진단 중 오류가 발생했습니다.', error: error.toString() });

        if (error instanceof TypeError) {
            res.status(400).json({ message: '잘못된 입력 형식입니다.', error: error.toString() });
        } else if (error instanceof Sequelize.DatabaseError) {
            res.status(500).json({ message: '데이터베이스 오류가 발생했습니다.', error: error.toString() });
        } else {
            res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.toString() });
        }
    }
};