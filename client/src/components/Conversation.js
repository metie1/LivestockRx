import React, { useState } from 'react';
import '../styles/Conversation.scss';

const Conversation = () => {
  const [form, setForm] = useState({
    tag: '',
    temperature: '',
    appetite: '',
    breathing: '',
    nose: '',
    energy: '',
    eyes: '',
    saliva: '',
    legs: '',
    urine: '',
    stool: '',
    conjunctiva: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="conversation-form">
      <form onSubmit={handleSubmit}>
        <label>
          개체 태그:
          <input
            type="text"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="개체 태그를 입력하세요"
          />
        </label>
        <fieldset>
          <legend>체온:</legend>
          <label><input type="radio" name="temperature" value="높은" onChange={handleChange} /> 높은</label>
          <label><input type="radio" name="temperature" value="낮은" onChange={handleChange} /> 낮은</label>
          <label><input type="radio" name="temperature" value="정상" onChange={handleChange} /> 정상</label>
        </fieldset>
        <fieldset>
          <legend>식욕부진:</legend>
          <label><input type="radio" name="appetite" value="식욕부진" onChange={handleChange} /> 식욕부진</label>
          <label><input type="radio" name="appetite" value="정상" onChange={handleChange} /> 정상</label>
        </fieldset>
        <fieldset>
          <legend>호흡:</legend>
          <label><input type="radio" name="breathing" value="가쁨" onChange={handleChange} /> 가쁨</label>
          <label><input type="radio" name="breathing" value="정상" onChange={handleChange} /> 정상</label>
        </fieldset>
        <fieldset>
          <legend>코흘림:</legend>
          <label><input type="radio" name="nose" value="있음" onChange={handleChange} /> 있음</label>
          <label><input type="radio" name="nose" value="없음" onChange={handleChange} /> 없음</label>
        </fieldset>
        <fieldset>
          <legend>원기:</legend>
          <label><input type="radio" name="energy" value="무리와 따로 놈" onChange={handleChange} /> 무리와 따로 놈</label>
          <label><input type="radio" name="energy" value="정상" onChange={handleChange} /> 정상</label>
        </fieldset>
        <fieldset>
          <legend>눈 점막:</legend>
          <label><input type="radio" name="eyes" value="창백" onChange={handleChange} /> 창백</label>
          <label><input type="radio" name="eyes" value="황색" onChange={handleChange} /> 황색</label>
          <label><input type="radio" name="eyes" value="정상" onChange={handleChange} /> 정상</label>
        </fieldset>
        <fieldset>
          <legend>침:</legend>
          <label><input type="radio" name="saliva" value="과다" onChange={handleChange} /> 과다</label>
          <label><input type="radio" name="saliva" value="정상" onChange={handleChange} /> 정상</label>
        </fieldset>
        <fieldset>
          <legend>다리:</legend>
          <label><input type="radio" name="legs" value="걸음걸이 이상" onChange={handleChange} /> 걸음걸이 이상</label>
          <label><input type="radio" name="legs" value="정상" onChange={handleChange} /> 정상</label>
        </fieldset>
        <fieldset>
          <legend>오줌:</legend>
          <label><input type="radio" name="urine" value="이상" onChange={handleChange} /> 이상</label>
          <label><input type="radio" name="urine" value="정상" onChange={handleChange} /> 정상</label>
        </fieldset>
        <fieldset>
          <legend>변:</legend>
          <label><input type="radio" name="stool" value="이상" onChange={handleChange} /> 이상</label>
          <label><input type="radio" name="stool" value="정상" onChange={handleChange} /> 정상</label>
        </fieldset>
        <fieldset>
          <legend>결막:</legend>
          <label><input type="radio" name="conjunctiva" value="이상" onChange={handleChange} /> 이상</label>
          <label><input type="radio" name="conjunctiva" value="정상" onChange={handleChange} /> 정상</label>
        </fieldset>
        <button type="submit" className="submit-button">제출</button>
        <button type="button" className="reset-button" onClick={() => setForm({
          tag: '',
          temperature: '',
          appetite: '',
          breathing: '',
          nose: '',
          energy: '',
          eyes: '',
          saliva: '',
          legs: '',
          urine: '',
          stool: '',
          conjunctiva: ''
        })}>변환</button>
      </form>
    </div>
  );
};

export default Conversation;
