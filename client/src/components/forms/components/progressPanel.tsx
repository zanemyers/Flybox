import { useEffect, useRef, useState } from "react";
import { Card, Button } from "react-bootstrap";

interface FileData {
  name: string;
  buffer?: string;
}

interface Props {
  route: string;
  jobId: string;
  handleClose: () => void;
}

type Status = "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "FAILED";

export default function ProgressPanel(props: Props) {
  const [status, setStatus] = useState<Status>("IN_PROGRESS");
  const [files, setFiles] = useState<FileData[]>([]);
  const progressAreaRef = useRef<HTMLPreElement>(null);

  // Store blob URLs
  const fileUrlsRef = useRef<Map<string, string>>(new Map());
  const downloadedFilesRef = useRef<Set<string>>(new Set());

  // Load saved file names on first render
  useEffect(() => {
    const saved = localStorage.getItem(`${props.route}-files`);
    if (saved)
      setFiles((JSON.parse(saved) as string[]).map((name) => ({ name })));
  }, [props.route]);

  // Keep localStorage in sync with file names
  useEffect(() => {
    if (files.length > 0) {
      const fileNames = JSON.stringify(files.map((f) => f.name));
      localStorage.setItem(`${props.route}-files`, fileNames);
    }
  }, [files, props.route]);

  // Poll server for progress updates
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const res = await fetch(`/api/${props.route}/${props.jobId}/updates`);
      const data = await res.json();

      if (progressAreaRef.current)
        progressAreaRef.current.textContent = data.message;

      setStatus(data.status);
      downloadFile(data.files);

      if (data.status !== "IN_PROGRESS") clearInterval(intervalId);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [props.route, props.jobId]);

  // Create or get object URL for a file
  const getFileUrl = (file: FileData) => {
    if (!file.buffer) return;

    if (!fileUrlsRef.current.has(file.name)) {
      const url = URL.createObjectURL(
        new Blob([Uint8Array.from(atob(file.buffer), (c) => c.charCodeAt(0))]),
      );
      fileUrlsRef.current.set(file.name, url);
    }

    return fileUrlsRef.current.get(file.name)!;
  };

  const downloadFile = (incomingFiles: FileData[]) => {
    setFiles((currentFiles) => {
      // Update buffers for existing files
      const updatedFiles = currentFiles.map((cf) => {
        const match = incomingFiles.find((f) => f.name === cf.name && f.buffer);
        return match ? { ...cf, buffer: match.buffer } : cf;
      });

      // Truly new files
      const existingNames = new Set(currentFiles.map((f) => f.name));
      const newFiles = incomingFiles.filter((f) => !existingNames.has(f.name));

      // Auto-download only truly new files
      newFiles.forEach((f) => {
        if (f.buffer && !downloadedFilesRef.current.has(f.name)) {
          const url = getFileUrl(f);
          if (url) {
            const link = document.createElement("a");
            link.href = url;
            link.download = f.name;
            link.click();
          }
          downloadedFilesRef.current.add(f.name);
        }
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
    // Revoke all blob URLs
    fileUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    fileUrlsRef.current.clear();

    localStorage.removeItem(`${props.route}-files`); // clear the files from local storage
    props.handleClose(); // delegate back to parent
  };

  return (
    <div className="d-flex flex-fill flex-column">
      <Card className="flex-fill shadow-sm">
        <Card.Body className="d-flex flex-column">
          <div className="mb-3">
            <Card.Title as="h5" className="mb-2">
              {status === "IN_PROGRESS"
                ? "🔄 Running Search..."
                : "✅ Completed"}
            </Card.Title>
            <pre
              ref={progressAreaRef}
              className="small text-monospace"
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>

          <div id="fileLinks" className="mt-auto mb-3">
            {files.map(
              (file) =>
                file.buffer && (
                  <a
                    key={file.name}
                    href={getFileUrl(file)}
                    download={file.name}
                    className="d-block mb-2 small"
                  >
                    {file.name}
                  </a>
                ),
            )}
          </div>

          <Button
            onClick={status === "IN_PROGRESS" ? handleCancel : handleClose}
            variant={status === "IN_PROGRESS" ? "danger" : "secondary"}
            className="w-100"
          >
            {status === "IN_PROGRESS" ? "Cancel" : "Close"}
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
