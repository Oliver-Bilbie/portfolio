import { CONTACT_API } from "./endpoints.js";

export async function sendContactRequest(email, message) {
  try {
    let response = await fetch(CONTACT_API, {
      method: "POST",
      body: JSON.stringify({
        contact_email: email,
        message: message,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let response_json = await response.json();

    return {
      is_success: true,
      message: response_json.message,
    };
  } catch (err) {
    console.error("Failed to send contact request:", err);
    return {
      is_success: false,
      message: "Unable to send your message. Please try again later.",
    };
  }
}
