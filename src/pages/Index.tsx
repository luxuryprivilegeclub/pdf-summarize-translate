
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "@/components/FileUploader";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ResultDisplay } from "@/components/ResultDisplay";
import { extractPdfText, summarizeText, translateText } from "@/lib/api";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [processingStep, setProcessingStep] = useState<string>("idle");

  const handleFileChange = (selectedFile: File | null) => {
    // Reset states when a new file is selected
    setFile(selectedFile);
    setExtractedText("");
    setSummary("");
    setTranslation("");
    setActiveTab("upload");
    setProcessingStep("idle");

    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds the 10MB limit. Please select a smaller file.");
      setFile(null);
    }
  };

  const handleProcess = async (action: "summarize" | "translate") => {
    if (!file) {
      toast.error("Please upload a PDF file first.");
      return;
    }

    setIsProcessing(true);
    setProcessingStep("extracting");

    try {
      // Step 1: Extract text from PDF
      const text = await extractPdfText(file);
      setExtractedText(text);
      setProcessingStep(action === "summarize" ? "summarizing" : "translating");

      // Step 2: Process the text based on selected action
      if (action === "summarize") {
        const result = await summarizeText(text);
        setSummary(result);
        setActiveTab("summary");
      } else {
        const result = await translateText(text);
        setTranslation(result);
        setActiveTab("translation");
      }

      setProcessingStep("completed");
      toast.success(`${action === "summarize" ? "Summary" : "Translation"} completed successfully!`);
    } catch (error) {
      console.error("Error processing document:", error);
      toast.error(`Failed to ${action} the document. Please try again.`);
      setProcessingStep("error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-3xl bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
        <CardHeader className="text-center border-b border-gray-100 bg-white/50">
          <CardTitle className="text-2xl font-medium tracking-tight text-gray-900">PDF Processor</CardTitle>
          <CardDescription className="text-gray-500 max-w-md mx-auto">
            Upload a PDF to summarize or translate it into Roman Urdu
          </CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full rounded-none border-b">
            <TabsTrigger value="upload" disabled={isProcessing}>Upload</TabsTrigger>
            <TabsTrigger value="summary" disabled={isProcessing || !summary}>Summary</TabsTrigger>
            <TabsTrigger value="translation" disabled={isProcessing || !translation}>Translation</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="p-0">
            <CardContent className="p-6">
              {isProcessing ? (
                <ProcessingStatus step={processingStep} />
              ) : (
                <FileUploader 
                  file={file} 
                  onFileChange={handleFileChange} 
                  accept=".pdf" 
                  maxSize={MAX_FILE_SIZE} 
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-100 bg-gray-50/50 p-4">
              <Button 
                variant="outline" 
                onClick={() => handleFileChange(null)} 
                disabled={!file || isProcessing}
                className="transition-all duration-200"
              >
                Clear
              </Button>
              <div className="space-x-2">
                <Button 
                  onClick={() => handleProcess("summarize")} 
                  disabled={!file || isProcessing}
                  className="bg-black hover:bg-gray-800 text-white transition-all duration-200"
                >
                  Summarize
                </Button>
                <Button 
                  onClick={() => handleProcess("translate")} 
                  disabled={!file || isProcessing}
                  className="bg-black hover:bg-gray-800 text-white transition-all duration-200"
                >
                  Translate
                </Button>
              </div>
            </CardFooter>
          </TabsContent>

          <TabsContent value="summary">
            <ResultDisplay 
              title="Summary in Roman Urdu" 
              content={summary} 
              onBack={() => setActiveTab("upload")}
            />
          </TabsContent>

          <TabsContent value="translation">
            <ResultDisplay 
              title="Translation in Roman Urdu" 
              content={translation}
              onBack={() => setActiveTab("upload")}
            />
          </TabsContent>
        </Tabs>
      </Card>
      
      <p className="text-xs text-gray-400 mt-8">
        Maximum file size: 10MB. Only PDF files are supported.
      </p>
    </div>
  );
};

export default Index;
