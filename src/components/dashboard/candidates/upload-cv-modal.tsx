"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, Check, AlertCircle, Loader2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UploadCVModalProps {
  onClose: () => void;
}

interface UploadedFile {
  file: File;
  status: "pending" | "uploading" | "parsing" | "done" | "error";
  candidate?: any;
  error?: string;
}

export function UploadCVModal({ onClose }: UploadCVModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf" || f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || f.type.startsWith("image/")
    );
    setFiles((prev) => [...prev, ...dropped.map((f) => ({ file: f, status: "pending" as const }))]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected.map((f) => ({ file: f, status: "pending" as const }))]);
  };

  const processFiles = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    for (let i = 0; i < files.length; i++) {
      setFiles((prev) =>
        prev.map((f, idx) => idx === i ? { ...f, status: "uploading" } : f)
      );

      await new Promise((r) => setTimeout(r, 500));

      setFiles((prev) =>
        prev.map((f, idx) => idx === i ? { ...f, status: "parsing" } : f)
      );

      await new Promise((r) => setTimeout(r, 1200));

      // Simulate success
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i
            ? {
                ...f,
                status: "done",
                candidate: {
                  name: `Candidate ${i + 1}`,
                  skills: ["Tally", "Excel"],
                  experience: "3 years",
                },
              }
            : f
        )
      );
    }

    setIsProcessing(false);
    toast.success(`${files.length} CV${files.length > 1 ? "s" : ""} parsed and added to database!`);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const allDone = files.length > 0 && files.every((f) => f.status === "done" || f.status === "error");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#0a0a12] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl z-10"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Bulk CV Upload</h2>
            <p className="text-sm text-white/40 mt-0.5">AI parses every CV automatically</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? "border-indigo-500 bg-indigo-500/5" : "border-white/10 hover:border-white/20"}`}
        >
          <Upload className="h-8 w-8 text-white/20 mx-auto mb-3" />
          <p className="text-sm text-white/60 mb-1">Drag & drop CVs here</p>
          <p className="text-xs text-white/30 mb-4">PDF, DOCX, Images supported</p>
          <label>
            <Button variant="outline" size="sm" asChild>
              <span>Browse Files</span>
            </Button>
            <input type="file" multiple accept=".pdf,.docx,.doc,image/*" onChange={handleFileInput} className="hidden" />
          </label>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6">
                <FileText className="h-4 w-4 text-white/40 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white/70 truncate">{f.file.name}</div>
                  <div className="text-xs text-white/30">
                    {(f.file.size / 1024).toFixed(0)} KB
                  </div>
                </div>
                <div className="shrink-0">
                  {f.status === "pending" && (
                    <button onClick={() => removeFile(i)} className="text-white/30 hover:text-red-400">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  {f.status === "uploading" && <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />}
                  {f.status === "parsing" && (
                    <div className="flex items-center gap-1">
                      <Brain className="h-4 w-4 text-purple-400 animate-pulse" />
                      <span className="text-xs text-purple-400">AI parsing...</span>
                    </div>
                  )}
                  {f.status === "done" && <Check className="h-4 w-4 text-emerald-400" />}
                  {f.status === "error" && <AlertCircle className="h-4 w-4 text-red-400" />}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          {allDone ? (
            <Button variant="gradient" className="flex-1" onClick={onClose}>
              Done — {files.filter((f) => f.status === "done").length} added
            </Button>
          ) : (
            <Button
              variant="gradient"
              className="flex-1"
              onClick={processFiles}
              loading={isProcessing}
              disabled={files.length === 0}
            >
              <Brain className="h-4 w-4" />
              Parse with AI
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
