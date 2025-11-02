export async function handler(event, context) {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyl9VImWWALaZUPlXxhf7gosErG7nRZb7DSIO95rrAcsJiwJb-yYE5FyOdjZd7Kpl4L7A/exec";

  try {
    // Forward the incoming request body to the Apps Script
    const resp = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: event.body
    });

    const text = await resp.text();

    return {
      statusCode: resp.status || 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
}
