import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // This is required for client-side usage
});

const formatDevice = (device) => {
    return `
- Name: ${device.name}
- Price: $${device.price}
- Storage: ${device.storage} GB
- Camera: ${device.camera} MP
- Battery: ${device.battery} mAh
    `;
}

export const fetchAIRecommendation = async (deviceA, deviceB) => {
  const prompt = `
    You are a helpful technology assistant.

    Compare the following two devices and recommend which one would be the better overall choice for a typical user.
    Based on these specifications, recommend ONE device over the other.
    Explain briefly why it is the better choice. 
    Keep the response upbeat and limited to 3-4 sentences.
    Do not repeat the specifications exactly — explain the benefits instead.
    If both devices are very similar, choose the one that offers the better overall value.

    Device A:
    ${formatDevice(deviceA)}

    Device B:
    ${formatDevice(deviceB)}
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching AI recommendation:', error);
    throw new Error('Failed to get recommendation. Please check your API key and try again.');
  }
};
