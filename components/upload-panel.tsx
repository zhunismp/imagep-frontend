"use client";

import { useRef, useState } from "react";
import { Upload, X, FileImage, Plus, Loader2 } from "lucide-react";
import { process, upload } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UploadPanel() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [taskId] = useState<string>(crypto.randomUUID());

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || uploading) return;

    const imageFiles = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );

    if (imageFiles.length === 0) return;

    setUploading(true);

    try {
      await upload(imageFiles, taskId);

      // add uploaded files into list after success
      setFiles((prev) => [...prev, ...imageFiles]);
    } catch (err) {
      console.log(err);
      toast.error("Failed to upload files", {
        richColors: true,
        position: "top-right",
      });
    } finally {
      setUploading(false);

      // allow re-uploading same files again
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error("No file to process", { richColors: true, position: "top-right" });
      return;
    }

    try {
      await process(taskId);
      router.push(`/download/${taskId}`);
    } catch (err) {
      console.log(err);
      toast.error("Failed to process files", {
        richColors: true,
        position: "top-right",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploading) return; // don't highlight / accept while uploading
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (uploading) return;
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
    <div className="w-full flex items-center justify-center bg-gray-50 p-4">
      <div
        className={`w-full max-w-4xl h-[520px] rounded-2xl border-2 border-dashed bg-white shadow-xl flex flex-col transition ${
          uploading
            ? "border-gray-300 opacity-[0.98]"
            : dragActive
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
          disabled={uploading}
          onChange={(e) => handleUpload(e.target.files)}
        />

        {/* header */}
        <div className="p-4 border-b flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              Files ({files.length})
            </p>

            {/* Always visible uploading indicator (even when files already exist) */}
            {uploading && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="animate-pulse">Uploading…</span>
              </div>
            )}
          </div>

          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Upload
              </>
            )}
          </button>
        </div>

        {/* scroll list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {files.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center">
              <Upload className="w-10 h-10 mb-3" />
              <p>{uploading ? "Uploading images…" : "Drag & drop images here"}</p>
              {uploading && (
                <p className="text-sm text-blue-600 mt-2 animate-pulse">
                  Please wait…
                </p>
              )}
            </div>
          )}

          {files.map((f, i) => (
            <div
              key={`${f.name}-${f.size}-${i}`}
              className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg"
            >
              <FileImage className="w-6 h-6 text-blue-600" />

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{f.name}</p>
                <p className="text-xs text-gray-500">{format(f.size)}</p>
              </div>

              <button
                onClick={() => removeFile(i)}
                disabled={uploading}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-red-600" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <button
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={files.length === 0 || uploading}
            onClick={handleProcess}
          >
            {uploading ? "Uploading…" : "Compress Images"}
          </button>
        </div>
      </div>
    </div>
  );
}