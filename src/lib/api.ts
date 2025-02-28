
/**
 * PDF text extraction function using PDF.js
 */
export const extractPdfText = async (file: File): Promise<string> => {
  try {
    // We need to convert the file to an ArrayBuffer so we can process it with pdf.js
    const arrayBuffer = await file.arrayBuffer();
    
    // Dynamically import the PDF.js library
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    // Get the total number of pages
    const numPages = pdf.numPages;
    let fullText = '';
    
    // Extract text from each page and combine
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Extract the text items and join them with spaces
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from the PDF');
  }
};

/**
 * Summarize text to bullet points in Roman Urdu
 */
export const summarizeText = async (text: string): Promise<string> => {
  try {
    // Only use the first 8000 characters to avoid API limitations
    const truncatedText = text.substring(0, 8000);
    
    // Using the DeepSeek API through OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
        'HTTP-Referer': window.location.href,
        'X-Title': 'PDF Processor'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat:free',
        messages: [
          {
            role: 'system',
            content: 'You are a professional summarizer. Your task is to extract the key points from the provided text and present them as bullet points in Roman Urdu (Urdu written using Latin script). Kindly summarize this document and give me summary in Bullet points and make summary in detail also. Focus on capturing the essential information in a concise format. Each bullet point should be on a new line starting with a "•" symbol.'
          },
          {
            role: 'user',
            content: truncatedText
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`API returned error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw new Error('Failed to generate summary');
  }
};

/**
 * Translate text to Roman Urdu
 */
export const translateText = async (text: string): Promise<string> => {
  try {
    // Only use the first 8000 characters to avoid API limitations
    const truncatedText = text.substring(0, 8000);
    
    // Using the DeepSeek API through OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
        'HTTP-Referer': window.location.href,
        'X-Title': 'PDF Processor'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat:free',
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator. Your task is to translate the provided text into Roman Urdu (Urdu written using Latin script). Maintain the original meaning, tone, and structure of the text. Ensure the translation is natural and fluent in Roman Urdu.'
          },
          {
            role: 'user',
            content: truncatedText
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`API returned error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error translating text:', error);
    throw new Error('Failed to translate text');
  }
};
