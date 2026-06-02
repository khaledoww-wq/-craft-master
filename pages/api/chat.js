import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const SYSTEM = `أنت مستشار تصميم خبير في مصنع Craft Master بالإمارات. المصنع يصنع: نيون LED، لوحات خشبية، أكريليك مضيء، حروف CNC ثلاثية الأبعاد، طباعة UV، نقش ليزر، حروف معدنية. تحدث بالعربية بشكل طبيعي ودود. افهم أي طلب وأجب عليه بدقة. قدم 3 تصاميم مختلفة عند كل طلب جديد. بعد ردك ضع التصاميم في كتلة JSON هكذا بالضبط:
\`\`\`json
[{"name":"اسم التصميم","type":"neon","color":"#ff2d78","label":"النص على اللوحة","price":250,"time":"3-4 أيام","desc":"وصف قصير"}]
\`\`\`
أنواع type المتاحة فقط: neon, wood, acrylic, 3d, uv, laser, metal
اختر الألوان بذكاء حسب المشروع. الأسعار بالدرهم الإماراتي.`;
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages } = req.body;
  if (!messages?.length) return res.status(400).json({ error: "No messages" });
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: SYSTEM,
      messages,
    });
    res.status(200).json({ content: response.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
