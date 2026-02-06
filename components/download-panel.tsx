"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { download } from "@/lib/actions";
import { toast } from "sonner";
import { Download as DownloadIcon, RefreshCw, FileImage } from "lucide-react";

async function forceDownload(url: string, filename: string) {
  // Try real download (needs GCS CORS if cross-origin)
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(objectUrl);
    return true;
  } catch {
    // Fallback: open the public URL (browser may preview image instead of downloading)
    window.open(url, "_blank", "noopener,noreferrer");
    return false;
  }
}

export default function DownloadPanel({ taskId }: { taskId: string }) {
  const { data, isPending, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["download", taskId],
    queryFn: () => download(taskId),
    refetchInterval: (q) =>
      q.state.data?.isCompleted ? false : q.state.data?.next ?? 2000,
    refetchIntervalInBackground: true,
    retry: 2,

    // If you truly want to show ONLY the latest response (even during refetch),
    // remove placeholderData. Keeping it makes UI not flicker.
    // placeholderData: (prev) => prev,
  });

  const files = useMemo(() => {
    return data?.completed ?? [];
  }, [data]);

  const onDownloadOne = useCallback(async (url: string, filename: string) => {
    const ok = await forceDownload(url, filename);
    if (!ok) {
      toast.message("Opened file in a new tab (set GCS CORS to force download).", {
        richColors: true,
        position: "top-right",
      });
    }
  }, []);

  const onDownloadAll = useCallback(async () => {
    if (!files.length) {
      toast.error("No files ready yet", { richColors: true, position: "top-right" });
      return;
    }

    // Avoid popup blockers by downloading via fetch/blob
    toast.success("Starting downloads…", { richColors: true, position: "top-right" });

    // Do sequential to reduce load + avoid blocking
    for (const f of files) {
      await onDownloadOne(f.signedUrl, f.filename);
    }
  }, [files, onDownloadOne]);

  if (isPending) return <div className="p-6">Loading…</div>;
  if (isError) return <div className="p-6 text-red-600">Error: {error.message}</div>;
  if (!data) return <div className="p-6">No data</div>;

  const done = data.progress.completed;
  const total = data.progress.total;
  const percent = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 space-y-4">
      {/* Header card */}
      <div className="rounded-2xl border bg-white shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-sm text-slate-500">Download</div>
            <div className="text-lg sm:text-xl font-semibold">Task #{data.taskId}</div>
            <div className="mt-1 text-sm text-slate-600">
              {data.isCompleted ? "Completed ✅" : "Processing…"}{" "}
              {isFetching ? "↻" : ""} • {done}/{total} ({percent}%)
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm hover:bg-slate-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <button
              onClick={onDownloadAll}
              disabled={files.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              <DownloadIcon className="w-4 h-4" />
              Download all
            </button>
          </div>
        </div>

        <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-slate-900 transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Files list (always shown) */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b flex items-center justify-between">
          <div className="font-semibold">Files ({files.length})</div>
          <div className="text-xs text-slate-500">Live view from API</div>
        </div>

        <div className="max-h-[60vh] overflow-auto">
          {files.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              No completed files yet. This page will update automatically.
            </div>
          ) : (
            <ul className="divide-y">
              {files.map((f) => (
                <li key={f.fileId} className="p-4 sm:px-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <FileImage className="w-5 h-5 text-slate-700" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{f.filename}</div>
                    <div className="truncate text-xs text-slate-500">{f.serverFilename}</div>
                  </div>

                  <button
                    onClick={() => onDownloadOne(f.signedUrl, f.filename)}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Download
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}