const express = require("express");
const app = express();
const jwt = require("./jwt");
const soapClient = require("./soapClient");

app.use(express.json());

// Simulación de base de datos en memoria
let solicitudes = [];
let contador = 1;

// Crear nueva solicitud
app.post("/solicitudes", jwt.validateToken, async (req, res) => {
  try {
    const resultado = await soapClient.sendSOAPRequest(req.body);

    const nuevaSolicitud = {
      id: contador++,
      estudiante_id: req.body.estudiante_id,
      tipo: req.body.tipo,
      datos: req.body.datos,
      estado: resultado,
    };

    solicitudes.push(nuevaSolicitud);

    res.json({
      estado: resultado,
      mensaje: `Solicitud de tipo ${req.body.tipo} procesada`,
      id: nuevaSolicitud.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

// Obtener TODAS las solicitudes
app.get("/solicitudes", jwt.validateToken, (req, res) => {
  res.json(solicitudes);
});

// Obtener una solicitud por ID
app.get("/solicitudes/:id", jwt.validateToken, (req, res) => {
  const solicitud = solicitudes.find((s) => s.id == req.params.id);
  if (!solicitud) {
    return res.status(404).json({ error: "Solicitud no encontrada" });
  }
  res.json(solicitud);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`SolicitudService corriendo en http://localhost:${PORT}`);
});
