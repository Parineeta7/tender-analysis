import React, { useState } from "react";

function InformationExtractor() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://localhost:8000/extract-info/", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to process file");
      const blob = await res.blob();
      // Get filename from Content-Disposition header
      const disposition = res.headers.get("Content-Disposition");
      let filename = "extracted_info.xlsx";
      if (disposition && disposition.indexOf("filename=") !== -1) {
        filename = disposition.split("filename=")[1].replace(/['\"]/g, "").trim();
      }
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #eee" }}>
      <h2>Information Extractor</h2>
      <p>Upload a tender PDF to extract and download a structured Excel report.</p>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload} disabled={loading || !file} style={{ padding: "0.5rem 1.5rem" }}>
        {loading ? "Processing..." : "Upload & Extract"}
      </button>
      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: 12 }}>Excel report downloaded successfully!</div>}
    </div>
  );
}

export default InformationExtractor; 