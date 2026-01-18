import { AI_CONFIG } from '../config/ai-keys';

export interface AnalysisResult {
  score: number;
  status: 'VERIFIED' | 'SUSPICIOUS' | 'FORGED';
  summary: string;
  checks: {
    name: string;
    status: 'PASS' | 'FAIL' | 'WARN';
    details: string;
  }[];
  metadata: {
    pageCount: number;
    detectedType: string;
    compression: string;
  };
}

export const analyzeContract = async (file: File): Promise<AnalysisResult> => {
  try {
    // 1. Convert File to Base64 for Gemini
    const base64Data = await fileToBase64(file);
    const mimeType = file.type;

    // 2. Step 1: Gemini OCR & Extraction
    const extractedData = await callGeminiOCR(base64Data, mimeType);

    // 3. Step 2: Groq Analysis
    const analysis = await callGroqAnalysis(extractedData);

    return parseAnalysis(analysis);
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    throw new Error("Failed to analyze contract. Please try again.");
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result?.toString().replace(/^data:(.*,)?/, '') || '';
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
};

const callGeminiOCR = async (base64: string, mimeType: string) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.MODELS.GEMINI}:generateContent?key=${AI_CONFIG.GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: "Extract all text from this contract document. Also identify any visual anomalies, different fonts, or signs of digital manipulation if visible. Return raw text and observations." },
          { inline_data: { mime_type: mimeType, data: base64 } }
        ]
      }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API Verification Error:", errorText);
    throw new Error(`Gemini API Error: ${response.status} - ${response.statusText}`);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No text extracted";
};

const callGroqAnalysis = async (extractedText: string) => {
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: AI_CONFIG.MODELS.GROQ,
      messages: [
        {
          role: "system",
          content: `You are a forensic document analyst AI. Analyze the provided contract text and observations for forgeries, inconsistencies, and structural issues.
          
          Detect:
          1. PDF Editor artifacts (Adobe, compression anomalies).
          2. Font inconsistencies (mismatched serifs, spacing).
          3. Metadata anomalies.
          4. Logical inconsistencies in clauses.

          Return strictly valid JSON in this format:
          {
            "score": number (0-100, where 100 is perfect integrity),
            "status": "VERIFIED" | "SUSPICIOUS" | "FORGED",
            "summary": "Short summary of findings...",
            "checks": [
              { "name": "Font Consistency", "status": "PASS" | "FAIL", "details": "..." },
              { "name": "PDF Metadata", "status": "PASS" | "FAIL", "details": "..." },
              { "name": "Digital Signature", "status": "PASS" | "FAIL", "details": "..." },
              { "name": "Clause Logic", "status": "PASS" | "FAIL", "details": "..." }
            ]
          }`
        },
        {
          role: "user",
          content: extractedText
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) throw new Error(`Groq API Error: ${response.statusText}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content;
};

const parseAnalysis = (jsonString: string): AnalysisResult => {
  try {
    const parsed = JSON.parse(jsonString);
    return {
      ...parsed,
      metadata: {
        pageCount: 1, // Placeholder as raw text doesn't explicitly give this without PDF.js
        detectedType: "Contract/Agreement",
        compression: "Standard"
      }
    };
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    return {
      score: 0,
      status: 'SUSPICIOUS',
      summary: "Failed to parse analysis results.",
      checks: [],
      metadata: { pageCount: 0, detectedType: "Unknown", compression: "Unknown" }
    };
  }
};
