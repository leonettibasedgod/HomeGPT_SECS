export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return res.status(500).json({ error: "Erro da OpenAI", detalhes: data });
    }

    res.status(200).json({ message: data.choices?.[0]?.message?.content });
  } catch (err) {
    res.status(500).json({ error: "Erro interno", detalhes: err.message });
  }
}