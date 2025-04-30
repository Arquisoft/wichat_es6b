const llmConfigs = {
  gemini: {
    url: (apiKey) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      transformRequest: (question, context = '') => ({
        contents: [
          {
            role: "user",
            parts: [{ text: context ? `${context}\n\n${question}` : question }]
          }
        ]
      }),
    transformResponse: (response) => response.data.candidates[0]?.content?.parts[0]?.text,
    headers: () => ({
      'Content-Type': 'application/json'
    })
  },
  empathy: {
    url: () => 'https://empathyai.prod.empathy.co/v1/chat/completions',
    transformRequest: (question, context =  'Deberas hablar en español' ) => ({
      model: "qwen/Qwen2.5-Coder-7B-Instruct",
      stream: false,
      messages: [
        { role: "system", content: context },
        { role: "user", content: question }
      ]
    }),
    transformResponse: (response) => response.data.choices[0]?.message?.content,
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    })
  }
};

module.exports = llmConfigs;