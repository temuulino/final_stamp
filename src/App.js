import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [stampImage, setStampImage] = useState(null);
  const [stampPosition, setStampPosition] = useState("right");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleStampImageChange = (event) => {
    setStampImage(event.target.files[0]);
  };

  const addStampToPdf = async () => {
    try {
      if (!selectedFile || !stampImage) {
        alert("Ээжээ pdf файл болон тамгаа сонгоорой");
        return;
      }

      const pdfDoc = await PDFDocument.load(await selectedFile.arrayBuffer());
      const stampBytes = await stampImage.arrayBuffer();
      const stampImageObj = await pdfDoc.embedPng(stampBytes);

      pdfDoc.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const stampDims = stampImageObj.scale(0.2); // Adjust stamp size based on your needs
        const stampWidth = stampDims.width;
        const stampHeight = stampDims.height;

        // Calculate stampX based on stampPosition
        let stampX;
        switch (stampPosition) {
          case "left":
            stampX = 0; // or some margin from the left edge
            break;
          case "center":
            stampX = width / 2 - stampWidth / 2;
            break;
          case "right":
            stampX = width - stampWidth; // subtract stampWidth to avoid drawing part of the stamp outside the page
            break;
          default:
            stampX = width - stampWidth; // Default to right if for some reason stampPosition is not set
        }

        const stampY = 10; // Adjust Y position as needed

        page.drawImage(stampImageObj, {
          x: stampX,
          y: stampY,
          width: stampWidth,
          height: stampHeight,
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

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    margin: "20px 0",
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    margin: "0 10px",
  };

  const positionTextStyle = {
    color: "#333",
    fontSize: "1.2rem",
    marginTop: "20px",
  };

  let stampX;
  const getPositionText = (position) => {
    switch (position) {
      case "left":
        return "Зүүн талд";
      case "center":
        return "Төвд";
      case "right":
        return "Баруун талд";
      default:
        return "";
    }
  };
  const stampY = 20;

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

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="pdfInput"
          style={{ fontSize: "1rem", color: "#555", display: "block" }}
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
            width: "80%",
            maxWidth: "300px",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="stampInput"
          style={{ fontSize: "1rem", color: "#555", display: "block" }}
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
            width: "80%",
            maxWidth: "300px",
          }}
        />
      </div>

      <div style={buttonContainerStyle}>
        <button style={buttonStyle} onClick={() => setStampPosition("left")}>
          Зүүн талд
        </button>
        <button style={buttonStyle} onClick={() => setStampPosition("center")}>
          Төвд
        </button>
        <button style={buttonStyle} onClick={() => setStampPosition("right")}>
          Баруун талд
        </button>
      </div>

      {stampPosition && (
        <div style={positionTextStyle}>
          Сонгосон байршил: {getPositionText(stampPosition)}
        </div>
      )}

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
