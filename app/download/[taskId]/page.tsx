import DownloadPanel from "@/components/download-panel";

export default async function Page(props: PageProps<"/download/[taskId]">) {
  const { taskId } = await props.params;
  return <DownloadPanel taskId={taskId} />;
}
