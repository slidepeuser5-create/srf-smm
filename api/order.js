export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { service, username, quantity, quality, email, utr } = req.body;

  const message = `
📦 *New Order Received!*
━━━━━━━━━━━━━━━━━━
👤 *Username:* ${username}
📱 *Service:* ${service}
⭐ *Quality:* ${quality}
📈 *Quantity:* ${quantity}
📧 *Email:* ${email}
💰 *Total:* ₹${(quantity * 0.06).toFixed(2)}  
🏦 *UTR / Transaction ID:* ${utr || "Not provided"}
━━━━━━━━━━━━━━━━━━
`;

  try {
    const telegramURL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const data = await response.json();
    console.log("Telegram response:", data);

    if (!data.ok) throw new Error(data.description);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending order:", error);
    return res.status(500).json({ error: "Failed to send order to Telegram" });
  }
}