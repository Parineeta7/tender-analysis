# First, install necessary packages
import subprocess
import sys

required_packages = ['pdfminer.six', 'xlsxwriter', 'pandas']
print("🔧 Installing required packages...")
subprocess.check_call([sys.executable, '-m', 'pip', 'install'] + required_packages)

# Now import the packages
import re
import os
import pandas as pd
from collections import defaultdict
from pdfminer.high_level import extract_text
from pdfminer.layout import LAParams
from typing import Dict, List, Tuple, Optional

print("✅ Packages imported successfully!")

# ========== Configuration ==========
class Config:
    SECTION_PATTERNS = {
        "bid_summary": r"(BID DETAILS|बोली विवरण|बोली मांक)",
        "important_dates": r"(BID END DATE|BID OPENING DATE|PRE-BID DATE|तारीख|समय)",
        "eligibility": r"(EXPERIENCE CRITERIA|ELIGIBILITY|अनुभव|पात्रता)",
        "technical_specifications": r"(TECHNICAL SPECIFICATIONS|तकनीकी विशिष्टियाँ|ITEM CATEGORY)",
        "financial": r"(EMD AMOUNT|ePBG|बजट|COST|VALUE|वित्तीय)",
        "submission": r"(DOCUMENT REQUIRED FROM SELLER|दस्तावेज़|DOCUMENTATION)",
        "evaluation": r"(EVALUATION METHOD|मूल्यांकन|RA QUALIFICATION RULE)",
        "preference_policy": r"(MSE|MSME|STARTUP|MAKE IN INDIA|पसंद|नीति)",
        "delivery_schedule": r"(DELIVERY DAYS|डिलीवरी के दिन|CONSIGNEE)"
    }

# ========== Summarizer ==========
def summarize_text(text: str, max_length: int = 300) -> str:
    sentences = re.split(r'(?<=[.?!])\s+', text.strip())
    summary = []
    total_length = 0
    for sentence in sentences:
        if len(sentence) < 20:
            continue
        if total_length + len(sentence) > max_length:
            break
        summary.append(sentence)
        total_length += len(sentence)
    return ' '.join(summary) + ('...' if total_length < len(text) else '')

# ========== PDF Processing ==========
class PDFProcessor:
    @staticmethod
    def extract_text_with_layout(pdf_path: str) -> str:
        laparams = LAParams(line_margin=0.5, char_margin=2.0, word_margin=0.1)
        return extract_text(pdf_path, laparams=laparams)

    @staticmethod
    def detect_sections(text: str) -> Dict[str, str]:
        sections = defaultdict(str)
        current_section = "other"
        for line in text.split('\n'):
            line = line.strip()
            if not line:
                continue
            matched = False
            for section, pattern in Config.SECTION_PATTERNS.items():
                if re.search(pattern, line, re.IGNORECASE):
                    current_section = section
                    matched = True
                    break
            sections[current_section] += line + "\n"
        return dict(sections)

# ========== BOQ Extraction ==========
def extract_boq_items(text: str) -> List[Dict[str, str]]:
    items = []
    lines = text.splitlines()
    current_item = {}
    patterns = {
        "Item Category": r"Item\s*Category\s*[:：]?\s*(.+)",
        "Quantity": r"Quantity\s*[:：]?\s*(.+)",
        "Delivery Days": r"Delivery\s*Days\s*[:：]?\s*(.+)",
        "Consignee": r"Consignee\s*[:：]?\s*(.+)"
    }
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if re.search(r"Item\s*Category", line, re.IGNORECASE):
            if current_item:
                items.append(current_item)
                current_item = {}
        for field, pattern in patterns.items():
            match = re.search(pattern, line, re.IGNORECASE)
            if match:
                current_item[field] = match.group(1).strip()
    if current_item:
        items.append(current_item)
    return items

# ========== Tender Analyzer ==========
class TenderAnalyzer:
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.raw_text = ""
        self.sections = {}

    def process_document(self):
        self.raw_text = PDFProcessor.extract_text_with_layout(self.pdf_path)
        self.sections = PDFProcessor.detect_sections(self.raw_text)

    def generate_excel_report(self, output_path: str):
        writer = pd.ExcelWriter(output_path, engine='xlsxwriter')
        workbook = writer.book
        wrap_format = workbook.add_format({'text_wrap': True})

        # ===== 1. Overview Sheet with summaries =====
        overview_data = {
            "Document Property": ["PDF File", "Total Sections", "Total Characters"],
            "Value": [self.pdf_path, len(self.sections), len(self.raw_text)]
        }
        overview_df = pd.DataFrame(overview_data)
        overview_df.to_excel(writer, sheet_name="Overview", index=False)

        # Section Summaries
        summary_data = [{"Section": s.upper(), "Summary": summarize_text(c)} for s, c in self.sections.items()]
        summary_df = pd.DataFrame(summary_data)
        summary_df.to_excel(writer, sheet_name="Overview", index=False, startrow=len(overview_df) + 3)

        overview_ws = writer.sheets['Overview']
        overview_ws.write(len(overview_df) + 2, 0, "Section Summaries")
        overview_ws.set_column('A:A', 30, wrap_format)
        overview_ws.set_column('B:B', 100, wrap_format)

        # ===== 2. Full Text Sheet =====
        full_df = pd.DataFrame([{"Content": self.raw_text}])
        full_df.to_excel(writer, sheet_name="Full Text", index=False)
        writer.sheets['Full Text'].set_column('A:A', 100, wrap_format)

        # ===== 3. Section Contents Sheet =====
        section_df = pd.DataFrame([{"Section": s.upper(), "Content": c.strip()} for s, c in self.sections.items()])
        section_df.to_excel(writer, sheet_name="Sections", index=False)
        sec_ws = writer.sheets['Sections']
        sec_ws.set_column('A:A', 30)
        sec_ws.set_column('B:B', 100, wrap_format)

        # ===== 4. BOQ Items Sheet =====
        if 'technical_specifications' in self.sections:
            items = extract_boq_items(self.sections['technical_specifications'])
            if items:
                boq_df = pd.DataFrame(items)
                boq_df.to_excel(writer, sheet_name="BOQ Items", index=False)
                boq_ws = writer.sheets["BOQ Items"]
                boq_ws.set_column('A:D', 30, wrap_format)

        # ===== 5. Important Dates Sheet =====
        if 'important_dates' in self.sections:
            dates_content = self.sections['important_dates']
            dates_data = []
            date_patterns = {
                "Bid End Date": r"Bid\s*End\s*Date\s*[:：]?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})",
                "Bid Opening Date": r"Bid\s*Opening\s*Date\s*[:：]?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})",
                "Pre-Bid Date": r"Pre-Bid\s*Date\s*[:：]?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})"
            }
            for label, pattern in date_patterns.items():
                match = re.search(pattern, dates_content, re.IGNORECASE)
                if match:
                    dates_data.append({"Event": label, "Date": match.group(1)})
            if dates_data:
                dates_df = pd.DataFrame(dates_data)
                dates_df.to_excel(writer, sheet_name="Important Dates", index=False)
                date_ws = writer.sheets['Important Dates']
                date_ws.set_column('A:A', 25, wrap_format)
                date_ws.set_column('B:B', 20)

        writer.close()
        print(f"✅ Excel report saved as: {output_path}")