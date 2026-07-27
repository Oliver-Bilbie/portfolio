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

    let response_json;
    try {
      response_json = await response.json();
    } catch {
      response_json = null;
    }

    if (!response.ok) {
      return {
        is_success: false,
        message:
          response_json?.message ||
          "Unable to send your message. Please try again later.",
      };
    }

    return {
      is_success: true,
      message: response_json?.message || "Message sent successfully",
    };
  } catch (err) {
    console.error("Failed to send contact request:", err);
    return {
      is_success: false,
      message: "Unable to send your message. Please try again later.",
    };
  }
}
