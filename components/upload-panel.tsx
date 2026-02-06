"use client";

import { useRef, useState } from "react";
import { Upload, X, FileImage, Plus } from "lucide-react";
import { process, upload } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function UploadPanel() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [taskId, _] = useState<string>(crypto.randomUUID())

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || uploading) return;

    const imageFiles = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );

    if (imageFiles.length === 0) return;

    setUploading(true);

    try {
      await upload(imageFiles, taskId);
      setFiles((prev) => [...prev, ...imageFiles]);
    } catch (err) {
      console.log(err)
      toast.error("Failed to upload files", { richColors: true, position: "top-right" });
    } finally {
      setUploading(false);
    }
  };

  const handleProcess = async () => {
    if (files.length == 0) {
      toast.error("No file to process", { richColors: true, position: "top-right" })
      return
    }

    try {
      await process(taskId)
      router.push(`/download/${taskId}`);
    } catch (err) {
      console.log(err)
      toast.error("Failed to process files", { richColors: true, position: "top-right" })
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  const removeFile = (i: number) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const format = (b: number) => {
    if (!b) return "0B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return (b / Math.pow(k, i)).toFixed(1) + sizes[i];
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div
        className={`w-full max-w-4xl h-[520px] rounded-2xl border-2 border-dashed bg-white shadow-xl flex flex-col transition ${dragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
          }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {/* hidden input */}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />

        {/* header */}
        <div className="p-4 border-b flex justify-between items-center">
          <p className="font-semibold text-gray-900">
            Files ({files.length})
          </p>

          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Upload
          </button>
        </div>

        {/* scroll list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {files.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center">
              <Upload className="w-10 h-10 mb-3" />
              <p>Drag & drop images here</p>
              {uploading && (
                <p className="text-sm text-blue-600 mt-2 animate-pulse">
                  Uploading…
                </p>
              )}
            </div>
          )}

          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg"
            >
              <FileImage className="w-6 h-6 text-blue-600" />

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{f.name}</p>
                <p className="text-xs text-gray-500">{format(f.size)}</p>
              </div>

              <button
                onClick={() => removeFile(i)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-red-600" />
              </button>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <button
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
            disabled={files.length === 0 || uploading}
            onClick={handleProcess}
          >
            Compress Images
          </button>
        </div>
      </div>
    </div>
  );
}
