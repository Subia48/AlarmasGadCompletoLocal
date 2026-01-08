const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = async function enviarSMS(numero, mensaje) {
  return client.messages.create({
    body: mensaje,
    from: process.env.TWILIO_PHONE,
    to: numero,
  });
};
