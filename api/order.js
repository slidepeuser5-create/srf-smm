export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { service, username, quantity, quality, email, utr } = req.body;

  const PRICE_PER_FOLLOWER = 0.10; // ✅ updated price

  const message = `
<b>📦 New Order Received!</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Username:</b> ${username}
📱 <b>Service:</b> ${service}
⭐ <b>Quality:</b> ${quality}
📈 <b>Quantity:</b> ${quantity}
📧 <b>Email:</b> ${email}
💰 <b>Total:</b> ₹${(quantity * PRICE_PER_FOLLOWER).toFixed(2)}
🏦 <b>UTR / Transaction ID:</b> ${utr || "Not provided"}
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
        parse_mode: "HTML",
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