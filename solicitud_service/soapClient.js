const axios = require("axios");

async function sendSOAPRequest(solicitud) {
  try {
    const response = await axios.post(
      "http://localhost:8001/mock-soap",
      solicitud
    );
    if (response.status === 200) {
      return "procesado";
    } else {
      return "en revisión";
    }
  } catch (err) {
    return "rechazado";
  }
}

module.exports = { sendSOAPRequest };
