const express = require("express");
const app = express();
app.use(express.json());

app.post("/mock-soap", (req, res) => {
  console.log("Mock SOAP recibió:", req.body);
  res.json({ resultado: "ok" });
});

app.listen(8001, () => {
  console.log("Mock SOAP escuchando en http://localhost:8001/mock-soap");
});
