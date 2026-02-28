import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState("");

  const handleFile = (f: File) => {
    const valid = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!valid.includes(f.type)) {
      toast({ title: "Invalid file", description: "Please upload a PDF or DOCX file.", variant: "destructive" });
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setAnalyzing(true);

    try {
      // Step 1: Upload to storage
      setProgress("Uploading resume…");
      const ext = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file);

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      // Step 2: Call AI analysis edge function
      setProgress("Analyzing with AI…");
      const { data, error: fnError } = await supabase.functions.invoke("analyze-resume", {
        body: { filePath },
      });

      if (fnError) throw new Error(`Analysis failed: ${fnError.message}`);
      if (data?.error) throw new Error(data.error);

      // Step 3: Store results and navigate
      localStorage.setItem("resumeAnalysis", JSON.stringify(data));

      toast({ title: "Analysis complete!", description: "Your resume has been analyzed by AI." });
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Resume analysis error:", err);
      toast({
        title: "Analysis failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
      setProgress("");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 pt-16">
      <div className="absolute inset-0 gradient-hero opacity-30" />
      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Upload Your Resume</h1>
          <p className="mt-2 text-muted-foreground">We'll analyze it with AI and provide insights</p>
        </div>

        <div className="glass-card-solid rounded-2xl p-8">
          <div
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
              dragOver ? "border-primary bg-primary/5" : file ? "border-success/50 bg-success/5" : "border-border"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !analyzing && fileRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {file ? (
              <>
                <CheckCircle2 className="mb-3 h-10 w-10 text-success" />
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <div className="mb-4 rounded-xl gradient-primary p-3">
                  <UploadIcon className="h-8 w-8 text-primary-foreground" />
                </div>
                <p className="font-medium text-foreground">Drop your resume here</p>
                <p className="mt-1 text-sm text-muted-foreground">or click to browse · PDF, DOCX</p>
              </>
            )}
          </div>

          <Button
            variant="hero"
            size="lg"
            className="mt-6 w-full"
            disabled={!file || analyzing}
            onClick={handleSubmit}
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {progress}
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Analyze Resume
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Upload;
