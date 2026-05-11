const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.analyzeSymptoms = async (symptoms) => {
  const prompt = `As a medical assistant AI, analyze the following symptoms and provide a list of possible conditions and the recommended medical specialization. 
  Symptoms: ${symptoms}
  Provide response in JSON format: { "possibleConditions": [], "recommendedSpecialization": "" }`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};

exports.getBookingAssistance = async (message, history) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant for a Doctor Appointment Booking App. Help users find doctors and book appointments." },
      ...history,
      { role: "user", content: message }
    ],
  });

  return response.choices[0].message.content;
};

exports.recommendDoctors = async (symptoms, doctorsList) => {
  const prompt = `Based on these symptoms: "${symptoms}", and this list of doctors: ${JSON.stringify(doctorsList)}, suggest the top 3 best doctors. 
  Consider their specialization, ratings, and experience. 
  Provide response in JSON format with an array of recommended doctor IDs and a reason for each.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};

exports.suggestOptimalSlots = async (doctorId, date, existingAppointments) => {
  const prompt = `Based on the following existing appointments for Doctor ID ${doctorId} on ${date}: ${JSON.stringify(existingAppointments)}, suggest the 3 best remaining 30-minute time slots between 09:00 AM and 05:00 PM. 
  Provide response in JSON format: { "optimalSlots": [] }`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};
