import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [stampImage, setStampImage] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleStampImageChange = (event) => {
    setStampImage(event.target.files[0]);
  };

  const addStampToPdf = async () => {
    try {
      if (!selectedFile || !stampImage) {
        // alert("Please select a PDF file and a stamp image.");
        alert("Ээжээ pdf file болон тамгаа сонгоорой");
        return;
      }

      const pdfDoc = await PDFDocument.load(await selectedFile.arrayBuffer());
      const stampBytes = await stampImage.arrayBuffer();
      const stampImageObj = await pdfDoc.embedPng(stampBytes);

      pdfDoc.getPages().forEach((page) => {
        const stampDims = stampImageObj.scale(0.2); // Adjust stamp size
        const { width, height } = page.getSize();
        const stampWidth = stampDims.width;
        const stampHeight = stampDims.height;

        const stampX = width - stampWidth - 20; // Position from right
        const stampY = 20; // Position from bottom

        page.drawImage(stampImageObj, {
          x: stampX,
          y: stampY,
          width: stampWidth,
          height: stampHeight,
          color: rgb(1, 0, 0), // Red color
        });
      });

      const modifiedPdfBytes = await pdfDoc.save();

      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "stamped_pdf.pdf";
      link.click();
    } catch (error) {
      console.error("Error adding stamp:", error);
    }
  };

  return (
    <div
      className="App"
      style={{
        textAlign: "center",
        marginTop: "50px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#333", fontSize: "2rem", marginBottom: "20px" }}>
        Ээжийн тамга
      </h1>
      <label
        htmlFor="pdfInput"
        style={{
          fontSize: "1rem",
          color: "#555",
          marginBottom: "10px",
          display: "block",
        }}
      >
        PDF файл сонгоно уу
      </label>
      <input
        id="pdfInput"
        type="file"
        onChange={handleFileChange}
        accept=".pdf"
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px",
          marginBottom: "20px",
          width: "80%",
          maxWidth: "300px",
        }}
      />
      <label
        htmlFor="stampInput"
        style={{
          fontSize: "1rem",
          color: "#555",
          marginBottom: "10px",
          display: "block",
        }}
      >
        Тамга сонгоно уу
      </label>
      <input
        id="stampInput"
        type="file"
        onChange={handleStampImageChange}
        accept=".png, .jpg, .jpeg"
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px",
          marginBottom: "20px",
          width: "80%",
          maxWidth: "300px",
        }}
      />
      <button
        onClick={addStampToPdf}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          padding: "10px 20px",
          fontSize: "1.2rem",
          cursor: "pointer",
        }}
      >
        Тамга Нэмэх
      </button>
      <div style={{ height: "30px" }}></div>
    </div>
  );
}

export default App;
