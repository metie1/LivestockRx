const handleConversation = (req, res) => {
    const { tag, temperature, appetite, breathing, nasalDischarge, energy, eyeMucosa, saliva, limping, urine, stool, conjunctiva } = req.body;
  
    let response = `개체 태그: ${tag}\n`;
    response += temperature === 'high' ? '체온이 높습니다. ' : temperature === 'low' ? '체온이 낮습니다. ' : '';
    response += appetite === 'poor' ? '식욕부진이 있습니다. ' : '';
    response += breathing === 'difficult' ? '호흡이 가쁩니다. ' : '';
    response += nasalDischarge === 'yes' ? '코흘림이 있습니다. ' : '';
    response += energy === 'lethargic' ? '원기가 없습니다. ' : '';
    response += eyeMucosa === 'pale' ? '눈 점막이 창백합니다. ' : eyeMucosa === 'yellow' ? '눈 점막이 황색입니다. ' : '';
    response += saliva === 'excessive' ? '침이 과다합니다. ' : '';
    response += limping === 'yes' ? '다리 절뚝거림이 있습니다. ' : '';
    response += urine === 'abnormal' ? '오줌에 이상이 있습니다. ' : '';
    response += stool === 'abnormal' ? '변에 이상이 있습니다. ' : '';
    response += conjunctiva === 'abnormal' ? '결막에 문제가 있습니다. ' : '';
  
    response = response.trim() || "특별한 증상이 없습니다. 추가적인 증상을 확인해 주세요.";
  
    res.status(200).json(response);
  };
    
  module.exports = { handleConversation };
  