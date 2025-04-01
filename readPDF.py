import PyPDF2

def readPDF(pdfFile):
    pdfText = []
    # Use a context manager to handle file opening
    with open(pdfFile, 'rb') as pdfFileObj:
        pdfReader = PyPDF2.PdfReader(pdfFileObj)
        # Iterate through pages using the updated API
        for page in pdfReader.pages:
            pdfText.append(page.extract_text())
    return pdfText

# Example usage
if __name__ == "__main__":
    print(readPDF('assessment.pdf'))