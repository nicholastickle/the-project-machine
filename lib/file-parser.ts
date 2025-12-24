import ExcelJS from 'exceljs'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

interface FileStructure {
  type: 'excel' | 'csv' | 'pdf'
  structure: any
  text_preview?: string
}

export async function parseExcelFile(buffer: Buffer): Promise<FileStructure> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)

  const sheets = workbook.worksheets.map(sheet => {
    const rows: any[] = []
    let headers: string[] = []

    sheet.eachRow((row, rowNumber) => {
      const values = row.values as any[]
      if (rowNumber === 1) {
        headers = values.slice(1).map(v => String(v || '').trim())
      } else {
        const rowData: any = {}
        values.slice(1).forEach((val, idx) => {
          const header = headers[idx] || `Column${idx + 1}`
          rowData[header] = val
        })
        rows.push(rowData)
      }
    })

    return {
      name: sheet.name,
      row_count: sheet.rowCount,
      column_count: sheet.columnCount,
      headers,
      sample_rows: rows.slice(0, 5) // First 5 rows only
    }
  })

  return {
    type: 'excel',
    structure: {
      sheet_count: sheets.length,
      sheets
    }
  }
}

export async function parseCSVFile(text: string): Promise<FileStructure> {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  
  const rows = lines.slice(1, 6).map(line => {
    const values = line.split(',')
    const row: any = {}
    headers.forEach((header, idx) => {
      row[header] = values[idx]?.trim() || ''
    })
    return row
  })

  return {
    type: 'csv',
    structure: {
      row_count: lines.length - 1,
      column_count: headers.length,
      headers,
      sample_rows: rows
    },
    text_preview: lines.slice(0, 10).join('\n')
  }
}

export async function parsePDFFile(buffer: Buffer): Promise<FileStructure> {
  const pdf = await getDocument({ data: buffer }).promise
  const numPages = pdf.numPages

  let fullText = ''
  const sections: string[] = []

  // Extract text from first 3 pages
  for (let i = 1; i <= Math.min(3, numPages); i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((item: any) => item.str).join(' ')
    fullText += pageText + '\n\n'

    // Detect section headings (simple heuristic: short lines in all caps or title case)
    const lines = pageText.split('\n')
    lines.forEach(line => {
      const trimmed = line.trim()
      if (trimmed.length > 5 && trimmed.length < 100) {
        if (trimmed === trimmed.toUpperCase() || /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(trimmed)) {
          sections.push(trimmed)
        }
      }
    })
  }

  return {
    type: 'pdf',
    structure: {
      page_count: numPages,
      detected_sections: sections.slice(0, 10) // First 10 sections
    },
    text_preview: fullText.slice(0, 2000) // First 2000 chars
  }
}

export async function parseFile(file: File): Promise<FileStructure> {
  const mimeType = file.type

  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
    const buffer = Buffer.from(await file.arrayBuffer())
    return parseExcelFile(buffer)
  } else if (mimeType === 'text/csv') {
    const text = await file.text()
    return parseCSVFile(text)
  } else if (mimeType === 'application/pdf') {
    const buffer = Buffer.from(await file.arrayBuffer())
    return parsePDFFile(buffer)
  }

  throw new Error(`Unsupported file type: ${mimeType}`)
}
