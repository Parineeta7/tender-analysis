from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import shutil
import os
from Information import TenderAnalyzer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/extract-info/")
async def extract_info(file: UploadFile = File(...)):
    # Save uploaded file
    pdf_path = f"temp_{file.filename}"
    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Process PDF
    analyzer = TenderAnalyzer(pdf_path)
    analyzer.process_document()
    excel_file = f"{pdf_path}_structured.xlsx"
    analyzer.generate_excel_report(excel_file)
    # Return Excel file
    response = FileResponse(excel_file, filename=os.path.basename(excel_file))
    # Optionally, cleanup files after sending (for production, use background tasks)
    return response
