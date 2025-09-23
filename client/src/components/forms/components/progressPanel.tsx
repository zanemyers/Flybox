import { useEffect, useRef, useState } from "react";

interface FileData {
  name: string;
  buffer?: string;
  url?: string; // blob URL we generate
}

interface ProgressPanelProps {
  route: string;
  jobId: string;
  close: () => void;
}

type Status = "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "FAILED";

export default function ProgressPanel(props: ProgressPanelProps) {
  const [status, setStatus] = useState<Status>("IN_PROGRESS");
  const [files, setFiles] = useState<FileData[]>([]);
  const progressAreaRef = useRef<HTMLPreElement>(null);

  // Load saved file names on first render
  useEffect(() => {
    const saved = localStorage.getItem(`${props.route}-files`);
    if (saved) {
      try {
        setFileNames(new Set(JSON.parse(saved)));
      } catch {
        setFileNames(new Set());
      }
    }
  }, [props.route]);

  // Keep localStorage in sync with fileNames
  useEffect(() => {
    localStorage.setItem(
      `${props.route}-files`,
      JSON.stringify([...fileNames]),
    );
  }, [fileNames, props.route]);

  // Poll server for progress updates
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function pollProgress() {
      if (status === "COMPLETED") return;

      const res = await fetch(`/api/${props.route}/${props.jobId}/updates`);
      const data = await res.json();

      // Update progress messages
      if (progressAreaRef.current) {
        progressAreaRef.current.textContent = data.message;
      }

      // Update status
      setStatus(data.status);

      // Handle new files
      downloadFile(data.files);
    }

    intervalId = setInterval(pollProgress, 1000);

    return () => clearInterval(intervalId);
  }, [props.route, props.jobId, status, files]);

  // When adding new files, check fileNames to prevent duplicates
  const downloadFile = (newFiles: FileData[]) => {
    newFiles.forEach((file) => {
      // Check if we already have a file with this name
      const exists = files.some((f) => f.name === file.name);
      if (!exists || !file.url) {
        const file: FileData = {
          ...file,
          url: file.url ?? getFileUrl(file.buffer!),
        };

        setFiles((prev) => [...prev, normalizedFile]);

        // Auto-download once
        const link = document.createElement("a");
        link.href = normalizedFile.url;
        link.download = file.name;
        link.click();
      }
    });
  };

  const handleCancel = async () => {
    await fetch(`/api/${props.route}/${props.jobId}/cancel`, {
      method: "POST",
    });
  };

  const cleanLocalStorage = () => {
    localStorage.removeItem(`${props.route}-files`);
    localStorage.removeItem(`${props.route}-jobId`);
    setFiles([]);
  };

  const getFileUrl = (buffer: string) => {
    const blob = new Blob([
      Uint8Array.from(atob(buffer), (c) => c.charCodeAt(0)),
    ]);
    return URL.createObjectURL(blob);
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
        onClick={status === "IN_PROGRESS" ? handleCancel : cleanLocalStorage}
        className={`w-100 btn ${status === "IN_PROGRESS" ? "btn-danger" : "btn-secondary"}`}
      >
        {status === "IN_PROGRESS" ? "Cancel" : "Close"}
      </button>
    </div>
  );
}
