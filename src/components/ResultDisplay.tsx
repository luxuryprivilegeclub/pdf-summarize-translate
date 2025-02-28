
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface ResultDisplayProps {
  title: string;
  content: string;
  onBack: () => void;
}

export function ResultDisplay({ title, content, onBack }: ResultDisplayProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  // Format the bullet points if the content is a summary
  const formattedContent = title.includes("Summary") 
    ? content
    : content;

  return (
    <>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleCopy}
            className="h-8 w-8 transition-all duration-200"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 max-h-[400px] overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{formattedContent}</pre>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-100 bg-gray-50/50 p-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="transition-all duration-200"
        >
          Back
        </Button>
        <Button 
          variant="outline" 
          onClick={handleCopy}
          className="transition-all duration-200"
        >
          Copy to Clipboard
        </Button>
      </CardFooter>
    </>
  );
}
