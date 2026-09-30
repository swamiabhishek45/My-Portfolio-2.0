import { PDFParse } from "pdf-parse";

/** Extract plain text from a resume PDF (pdf-parse v2). */
export async function parseResumePdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text ?? "";
  } finally {
    await parser.destroy();
  }
}
