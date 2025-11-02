// /api/order.js
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST requests allowed" });

  const { action, username, quantity, quality, price, email, orderId } = req.body || {};

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Missing Telegram credentials" });
  }

  let message = "";

  if (action === "order") {
    message = `
📦 *New Order*
👤 Username: ${username}
💰 Amount: ₹${price}
📈 Quantity: ${quantity}
⭐ Quality: ${quality}
📧 Email: ${email}
🆔 Order ID: ${orderId || Date.now()}
`;
  } else if (action === "markPaid") {
    message = `
💸 *Payment Confirmed!*
📧 Email: ${email}
🆔 Order ID: ${orderId || "N/A"}
`;
  } else {
    return res.status(400).json({ error: "Invalid action" });
  }

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown"
      })
    });

    if (!telegramRes.ok) throw new Error("Telegram API request failed");

    return res.status(200).json({ success: true, orderId: orderId || Date.now() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}