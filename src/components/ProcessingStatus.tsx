
import { cn } from "@/lib/utils";

interface ProcessingStatusProps {
  step: string;
}

export function ProcessingStatus({ step }: ProcessingStatusProps) {
  const steps = [
    { id: "extracting", label: "Extracting Text", icon: "document" },
    { id: "summarizing", label: "Generating Summary", icon: "list" },
    { id: "translating", label: "Translating Content", icon: "languages" },
    { id: "completed", label: "Processing Complete", icon: "check" },
    { id: "error", label: "Processing Failed", icon: "error" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "document":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case "list":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        );
      case "languages":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.20l-.8 2H12a1 1 0 110 2h-5.2l-.8 2H10a1 1 0 110 2H7a1 1 0 01-.95-.68L3.33 6H2a1 1 0 010-2h1.67l.64-1.6A1 1 0 015.2 2H7zm3 5H7.8l-1.6 4h2.4l-1.6-4zm6.8 3a1 1 0 110 2h-1.67l-.64 1.6a1 1 0 01-.94.68h-1.8a1 1 0 010-2h1.2l.8-2H9a1 1 0 110-2h5.2l.8-2H12a1 1 0 110-2h3a1 1 0 01.95.68L18.67 8H20a1 1 0 010 2h-1.67l-.64 1.6A1 1 0 0116.8 12h-1.8l1.6 4H18a1 1 0 010 2h-3a1 1 0 01-.95-.68L12.33 12H11a1 1 0 010-2h1.33l.95-2.32z" clipRule="evenodd" />
          </svg>
        );
      case "check":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case "error":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full py-12">
      <div className="flex flex-col items-center justify-center space-y-8">
        <h3 className="text-lg font-medium text-gray-900">Processing Your Document</h3>
        
        <div className="w-full max-w-md">
          {steps.map((s, index) => {
            // Skip the steps that aren't relevant to the current process
            // (e.g., skip "summarizing" if we're translating)
            if ((step === "translating" && s.id === "summarizing") || 
                (step === "summarizing" && s.id === "translating")) {
              if (s.id !== step) return null;
            }
            
            // Skip completed and error for initial rendering
            if ((s.id === "completed" || s.id === "error") && step !== s.id) {
              return null;
            }
            
            const isActive = s.id === step;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div key={s.id} className="flex items-center mb-4">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-all duration-300",
                    isActive ? "bg-black text-white" : 
                    isCompleted ? "bg-green-500 text-white" : 
                    "bg-gray-200 text-gray-500"
                  )}
                >
                  {getIcon(s.icon)}
                </div>
                <div className="ml-4 flex-1">
                  <p className={cn(
                    "font-medium transition-all duration-300",
                    isActive ? "text-gray-900" : 
                    isCompleted ? "text-green-700" : 
                    "text-gray-500"
                  )}>
                    {s.label}
                  </p>
                </div>
                {isActive && (
                  <div className="w-5 h-5 ml-2 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
                )}
              </div>
            );
          })}
        </div>
        
        <p className="text-sm text-gray-500 max-w-md text-center">
          {step === "extracting" && "Extracting text from your PDF file..."}
          {step === "summarizing" && "Creating a concise summary in Roman Urdu..."}
          {step === "translating" && "Translating the document into Roman Urdu..."}
          {step === "completed" && "Your document has been processed successfully!"}
          {step === "error" && "We encountered an error while processing your document. Please try again."}
        </p>
      </div>
    </div>
  );
}
