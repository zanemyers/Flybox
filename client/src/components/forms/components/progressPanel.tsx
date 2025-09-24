import { useEffect, useMemo, useRef, useState } from "react";

interface FileData {
  name: string;
  buffer?: string;
  url?: string; // blob URL we generate
}

interface ProgressPanelProps {
  route: string;
  jobId: string;
  handleClose: () => void;
}

type Status = "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "FAILED";

export default function ProgressPanel(props: ProgressPanelProps) {
  const [status, setStatus] = useState<Status>("IN_PROGRESS");
  const [files, setFiles] = useState<FileData[]>([]);
  const progressAreaRef = useRef<HTMLPreElement>(null);

  // Load saved file names on first render
  useEffect(() => {
    const saved = localStorage.getItem(`${props.route}-files`);
    if (saved)
      setFiles((JSON.parse(saved) as string[]).map((name) => ({ name })));
  }, [props.route]);

  // Keep localStorage in sync with fileNames
  const fileNames = useMemo(() => files.map((f) => f.name), [files]);
  useEffect(() => {
    localStorage.setItem(`${props.route}-files`, JSON.stringify(fileNames));
  }, [fileNames, props.route]);

  // Poll server for progress updates
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const res = await fetch(`/api/${props.route}/${props.jobId}/updates`);
      const data = await res.json();

      if (progressAreaRef.current)
        progressAreaRef.current.textContent = data.message;

      setStatus(data.status);
      downloadFile(data.files);

      // Stop polling if no longer in progress
      if (data.status !== "IN_PROGRESS") clearInterval(intervalId);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [props.route, props.jobId]);

  // When adding new files, check fileNames to prevent duplicates
  const downloadFile = (incomingFiles: FileData[]) => {
    const getFileUrl = (buffer: string) =>
      URL.createObjectURL(
        new Blob([Uint8Array.from(atob(buffer), (c) => c.charCodeAt(0))]),
      );

    setFiles((currentFiles) => {
      const existingNames = new Set(currentFiles.map((f) => f.name));

      const updatedFiles = currentFiles.map((cf) => {
        if (cf.url) return cf;
        const match = incomingFiles.find((f) => f.name === cf.name);
        return match
          ? { ...cf, buffer: match.buffer, url: getFileUrl(match.buffer!) }
          : cf;
      });

      const newFiles = incomingFiles
        .filter((f) => !existingNames.has(f.name))
        .map((f) => {
          const url = getFileUrl(f.buffer!);

          // Auto-download new files
          const link = document.createElement("a");
          link.href = url;
          link.download = f.name;
          link.click();

          return { ...f, url };
        });

      return [...updatedFiles, ...newFiles];
    });
  };

  const handleCancel = async () => {
    await fetch(`/api/${props.route}/${props.jobId}/cancel`, {
      method: "POST",
    });
  };

  const handleClose = () => {
    files.forEach((f) => {
      if (f.url) URL.revokeObjectURL(f.url); // revoke the file urls
    });

    localStorage.removeItem(`${props.route}-files`); // clear the files from local storage
    props.handleClose(); // delegate back to parent
  };

  return (
    <div className="p-4 border rounded bg-white shadow-sm flex-fill d-flex flex-column">
      <div className="mb-3">
        <h5 className="mb-2">
          {status === "IN_PROGRESS" ? "🔄 Running Search..." : "✅ Completed"}
        </h5>
        <pre
          ref={progressAreaRef}
          className="small text-monospace"
          style={{ whiteSpace: "pre-wrap" }}
        />
      </div>

      <div id="fileLinks" className="mt-auto mb-3">
        {files.map(({ name, url }: FileData) => (
          <a
            key={name}
            href={url}
            download={name}
            className="d-block mb-2 small"
          >
            {name}
          </a>
        ))}
      </div>

      <button
        onClick={status === "IN_PROGRESS" ? handleCancel : handleClose}
        className={`w-100 btn ${status === "IN_PROGRESS" ? "btn-danger" : "btn-secondary"}`}
      >
        {status === "IN_PROGRESS" ? "Cancel" : "Close"}
      </button>
    </div>
  );
}
