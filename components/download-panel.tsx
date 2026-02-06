"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { download } from "@/lib/actions";
import { toast } from "sonner";
import { RefreshCw, FileImage } from "lucide-react";

async function forceDownload(url: string, filename: string) {
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
  });

  const completed = useMemo(() => data?.completed ?? [], [data]);
  const failed = useMemo(() => data?.failed ?? [], [data]);
  const filesCount = completed.length + failed.length;

  const onDownloadOne = useCallback(async (url: string, filename: string) => {
    const ok = await forceDownload(url, filename);
    if (!ok) {
      toast.message("Opened file in a new tab.", {
        richColors: true,
        position: "top-right",
      });
    }
  }, []);

  if (isPending) return <div className="p-6">Loading…</div>;
  if (isError) return <div className="p-6 text-red-600">Error: {error.message}</div>;
  if (!data) return <div className="p-6">No data</div>;

  const done = data.progress.completed;
  const total = data.progress.total;
  const percent = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-6xl p-3 sm:p-5 space-y-3">
      {/* Header */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-sm text-slate-500">Download</div>
            <div className="text-lg sm:text-xl font-semibold">
              Task #{data.taskId}
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {data.isCompleted ? "Completed ✅" : "Processing…"} {isFetching ? "↻" : ""} •{" "}
              {done}/{total} ({percent}%)
            </div>
          </div>

          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-slate-900 transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Files */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b flex items-center justify-between">
          <div className="font-semibold">Files ({filesCount})</div>
        </div>

        <div className="max-h-[60vh] overflow-auto p-3 sm:p-5 space-y-5">
          {/* Completed */}
          <div>
            <div className="mb-2 text-sm font-semibold">
              Completed ({completed.length})
            </div>

            {completed.length === 0 ? (
              <div className="text-sm text-slate-500">No completed files yet.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {completed.map((f) => (
                  <button
                    key={f.fileId}
                    onClick={() => onDownloadOne(f.signedUrl, f.filename)}
                    className="text-left rounded-2xl border bg-white p-3 hover:bg-slate-50 active:scale-[0.99] transition"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <FileImage className="w-4 h-4 text-slate-700" />
                      </div>

                      <div className="truncate text-sm font-medium">
                        {f.filename}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Failed */}
          <div>
            <div className="mb-2 text-sm font-semibold text-rose-700">
              Failed ({failed.length})
            </div>

            {failed.length === 0 ? (
              <div className="text-sm text-slate-500">No failed files 🎉</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {failed.map((f: any) => (
                  <div
                    key={f.fileId ?? f.filename}
                    className="rounded-2xl border border-rose-200 bg-rose-50/60 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                        <FileImage className="w-4 h-4 text-rose-700" />
                      </div>

                      <div className="truncate text-sm font-medium text-rose-900">
                        {f.filename ?? "Unknown file"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}