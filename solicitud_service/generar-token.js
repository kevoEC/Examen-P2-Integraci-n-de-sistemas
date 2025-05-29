const jwt = require("jsonwebtoken");
const token = jwt.sign({ usuario: "kevin" }, "clave-secreta", {
  expiresIn: "1h",
});
console.log("Token generado:");
console.log(token);
