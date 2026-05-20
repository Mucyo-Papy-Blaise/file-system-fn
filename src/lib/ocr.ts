import { createWorker } from "tesseract.js";
import pdfjsLib from "./pdfjs-setup";

const extractTextFromImage = async (file: File): Promise<string> => {
  const worker = await createWorker("eng");
  const {
    data: { text },
  } = await worker.recognize(file);
  await worker.terminate();
  return text;
};

const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2.0 });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: canvas.getContext("2d")!,
    viewport,
    canvas,
  }).promise;

  return new Promise<string>((resolve) => {
    canvas.toBlob(async (blob) => {
      const worker = await createWorker("eng");
      const {
        data: { text },
      } = await worker.recognize(blob!);
      await worker.terminate();
      resolve(text);
    });
  });
};

export const extractText = async (file: File): Promise<string> => {
  if (file.type === "application/pdf") {
    return extractTextFromPDF(file);
  }
  return extractTextFromImage(file);
};
