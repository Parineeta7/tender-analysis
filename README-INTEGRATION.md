# Information Extractor Integration Guide

This document explains, in detail, how the Information Extractor tool was integrated into your project, covering both the React frontend and the FastAPI Python backend. It includes setup, architecture, code structure, and troubleshooting tips.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Backend Setup (FastAPI + Python)](#backend-setup-fastapi--python)
    - [Python Environment & Dependencies](#python-environment--dependencies)
    - [Information Extractor Logic](#information-extractor-logic)
    - [FastAPI Server](#fastapi-server)
    - [CORS Configuration](#cors-configuration)
4. [Frontend Setup (React)](#frontend-setup-react)
    - [InformationExtractor Component](#informationextractor-component)
    - [Routing](#routing)
5. [How It Works (End-to-End)](#how-it-works-end-to-end)
6. [Usage Instructions](#usage-instructions)
7. [Troubleshooting & Tips](#troubleshooting--tips)
8. [Extending the System](#extending-the-system)

---

## Project Overview

You have built a full-stack solution that allows users to upload a tender PDF, extract structured information from it using a Python script, and download the results as an Excel file—all from a modern React web interface.

---

## Architecture

```
[User Browser]
    |
    |  (1) Upload PDF
    v
[React Frontend (Vite, React, InformationExtractor.jsx)]
    |
    |  (2) POST /extract-info/ (PDF file)
    v
[FastAPI Backend (main.py, Information.py)]
    |
    |  (3) Process PDF, generate Excel
    v
[FastAPI Backend]
    |
    |  (4) Respond with Excel file
    v
[React Frontend]
    |
    |  (5) Download Excel file
    v
[User Browser]
```

---

## Backend Setup (FastAPI + Python)

### Python Environment & Dependencies
- **Key packages:** `fastapi`, `uvicorn`, `pdfminer.six`, `xlsxwriter`, `pandas`
- Install with:
  ```sh
  pip install fastapi uvicorn pdfminer.six xlsxwriter pandas
  ```

### Information Extractor Logic
- The core extraction logic is in `Information.py` (copied to the backend directory).
- The script:
  - Extracts text from PDFs
  - Detects and splits sections
  - Summarizes content
  - Extracts BOQ items and important dates
  - Generates a multi-sheet Excel report
- All interactive Colab/upload/download code was removed for backend use.

### FastAPI Server
- `main.py` exposes a `/extract-info/` endpoint:
  - Accepts a PDF file upload (POST)
  - Runs the `TenderAnalyzer` logic
  - Returns the generated Excel file as a download
- The filename is preserved in the response for a user-friendly download.

### CORS Configuration
- CORS middleware is enabled to allow the React frontend to communicate with the backend:
  ```python
  from fastapi.middleware.cors import CORSMiddleware
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

---

## Frontend Setup (React)

### InformationExtractor Component
- Located at `src/components/Tools/InformationExtractor.jsx`
- Features:
  - File input for PDF
  - Uploads PDF to backend
  - On success, automatically downloads the Excel file using the filename from the backend
  - Shows error and success messages
- Uses the Fetch API to POST the file and handle the response.

### Routing
- In `src/App.jsx`, the following route was added:
  ```jsx
  <Route path="/tools/information-extractor" element={<InformationExtractor />} />
  ```
- This makes the tool accessible at `/tools/information-extractor` in your app.

---

## How It Works (End-to-End)

1. **User visits** `/tools/information-extractor` in the React app.
2. **User uploads** a PDF file.
3. **Frontend sends** the file to the FastAPI backend (`/extract-info/`).
4. **Backend processes** the PDF, generates an Excel report, and responds with the file.
5. **Frontend triggers** an automatic download of the Excel file for the user.

---

## Usage Instructions

### 1. Start the Backend
```sh
cd backend
python -m uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend
```sh
cd frontend
npm install  # if not already done
npm run dev
```

### 3. Use the Tool
- Go to `http://localhost:5173/tools/information-extractor`
- Upload a PDF
- Wait for processing
- The Excel file will download automatically when ready

---

## Troubleshooting & Tips

- **NetworkError / CORS:**
  - Ensure backend is running and CORS is enabled.
  - Both frontend and backend should be running on localhost (or update URLs as needed).
- **Uvicorn not found:**
  - Use `python -m uvicorn main:app --reload --port 8000` instead of `uvicorn ...`.
- **ModuleNotFoundError (google.colab):**
  - All Colab-specific code was removed from `Information.py` for backend use.
- **Excel not downloading:**
  - Check browser pop-up/download settings.
  - Ensure backend returns the correct `Content-Disposition` header.
- **File cleanup:**
  - Temporary files are not auto-deleted. For production, consider cleaning up after download.

---

## Extending the System
- **Security:** Restrict CORS origins in production.
- **UI/UX:** Add progress bars, file type/size validation, or drag-and-drop upload.
- **Backend:** Add authentication, logging, or background processing for large files.
- **Deployment:** Deploy backend (e.g., on Heroku, AWS, etc.) and update frontend API URL accordingly.

---

**This guide documents the full integration and workflow for your Information Extractor tool. If you need further customization or have questions, just ask!** 