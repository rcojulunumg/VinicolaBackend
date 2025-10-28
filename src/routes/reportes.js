import express from "express";
import PDFDocument from "pdfkit";
import { createCanvas } from "canvas";
//import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Resend } from 'resend';

dotenv.config();
const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// Función para crear una gráfica de línea simple
const generarGrafica = (datos, etiqueta) => {
  const width = 600;
  const height = 250;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Fondo
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Ejes
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(40, 10);
  ctx.lineTo(40, height - 30);
  ctx.lineTo(width - 10, height - 30);
  ctx.stroke();

  // Escalar datos
  const max = Math.max(...datos);
  const min = Math.min(...datos);
  const escalaY = (height - 60) / (max - min || 1);

  // Dibujar línea
  ctx.strokeStyle = "#1e88e5";
  ctx.lineWidth = 2;
  ctx.beginPath();
  datos.forEach((val, i) => {
    const x = 40 + (i * (width - 70)) / (datos.length - 1);
    const y = height - 30 - (val - min) * escalaY;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Etiqueta
  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.fillText(etiqueta, 50, 20);

  return canvas.toBuffer("image/png");
};

// Función para generar PDF con gráfica y tabla
const generarPDF = (titulo, lecturas, tipo) => {
  return new Promise((resolve) => {
    const buffers = [];
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // Encabezado
    doc.fontSize(20).text(titulo, { align: "center" });
    doc.moveDown(1);

    // Generar gráfica
    const valores = lecturas.map((r) =>
      tipo === "historico" ? r.temperatura : r.azucar
    );
    const etiquetaGrafica = tipo === "historico" ? "Temperatura (°C)" : "Nivel de Azúcar (°Brix)";
    const graficaBuffer = generarGrafica(valores, etiquetaGrafica);

    // Insertar gráfica
    doc.image(graficaBuffer, { fit: [500, 250], align: "center" });
    doc.moveDown(1.5);

    // Encabezado tabla
    const encabezado = tipo === "historico"
      ? ["Día", "Temperatura (°C)", "Humedad (%)"]
      : ["Lote", "Cantidad (kg)", "Azúcar (°Brix)", "Acidez (g/L)"];

    doc.font("Helvetica-Bold").fontSize(12);
    doc.text(encabezado.join(" | "), { align: "left" });
    doc.moveDown(0.3);
    doc.font("Helvetica").fontSize(11);

    // Filas de tabla
    lecturas.forEach((r) => {
      const fila = tipo === "historico"
        ? `${r.dia} | ${r.temperatura.toFixed(1)} | ${r.humedad.toFixed(1)}`
        : `${r.lote} | ${r.cantidad} | ${r.azucar.toFixed(1)} | ${r.acidez.toFixed(1)}`;
      doc.text(fila);
    });

    // Resumen
    doc.moveDown(1.5);
    doc.font("Helvetica-Bold").text("Resumen general:");
    doc.font("Helvetica").fontSize(11);

    if (tipo === "historico") {
      const tempProm = (
        lecturas.reduce((acc, l) => acc + l.temperatura, 0) / lecturas.length
      ).toFixed(1);
      const humProm = (
        lecturas.reduce((acc, l) => acc + l.humedad, 0) / lecturas.length
      ).toFixed(1);
      doc.text(`Temperatura promedio: ${tempProm} °C`);
      doc.text(`Humedad promedio: ${humProm} %`);
    } else {
      const azProm = (
        lecturas.reduce((acc, l) => acc + l.azucar, 0) / lecturas.length
      ).toFixed(1);
      const acProm = (
        lecturas.reduce((acc, l) => acc + l.acidez, 0) / lecturas.length
      ).toFixed(1);
      doc.text(`Azúcar promedio: ${azProm} °Brix`);
      doc.text(`Acidez promedio: ${acProm} g/L`);
    }

    doc.end();
  });
};

// Endpoint para enviar PDF por correo
router.post("/enviar", async (req, res) => {
  const { tipo, correo } = req.body;

  let titulo = "";
  let lecturas = [];

  if (tipo === "historico") {
    titulo = "Reporte Histórico de Sensores";
    lecturas = Array.from({ length: 15 }, (_, i) => ({
      dia: `Día ${i + 1}`,
      temperatura: 18 + Math.random() * 10,
      humedad: 40 + Math.random() * 20,
    }));
  } else {
    titulo = "Reporte de Cosecha";
    lecturas = Array.from({ length: 10 }, (_, i) => ({
      lote: `Lote ${i + 1}`,
      cantidad: 800 + Math.floor(Math.random() * 300),
      azucar: 20 + Math.random() * 5,
      acidez: 5 + Math.random() * 2,
    }));
  }

  const pdf = await generarPDF(titulo, lecturas, tipo);

  try {
    const base64PDF = pdf.toString("base64");

    const data = await resend.emails.send({
      from: `"Sistema Vinícola" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: titulo,
      text: "Se adjunta el reporte solicitado.",
      attachments: [
        {
          filename: `${titulo}.pdf`,
          content: base64PDF,
          encoding: "base64",
        },
      ],
    });
    
    console.log("Correo enviado:", data);
    res.json({ message: "Reporte enviado correctamente" });
  } catch (err) {
    console.error("Error al enviar correo:", err);
    res.status(500).json({ error: "Error enviando correo" });
  }
});


// Endpoint para generar PDF directamente
router.post("/:tipo", async (req, res) => {
  const { tipo } = req.params;
  let titulo = "";
  let lecturas = [];

  if (tipo === "historico") {
    titulo = "Reporte Histórico de Sensores";
    lecturas = Array.from({ length: 15 }, (_, i) => ({
      dia: `Día ${i + 1}`,
      temperatura: 18 + Math.random() * 10,
      humedad: 40 + Math.random() * 20,
    }));
  } else {
    titulo = "Reporte de Cosecha";
    lecturas = Array.from({ length: 10 }, (_, i) => ({
      lote: `Lote ${i + 1}`,
      cantidad: 800 + Math.floor(Math.random() * 300),
      azucar: 20 + Math.random() * 5,
      acidez: 5 + Math.random() * 2,
    }));
  }

  const pdf = await generarPDF(titulo, lecturas, tipo);
  res.setHeader("Content-Type", "application/pdf");
  res.send(pdf);
});

export default router;
