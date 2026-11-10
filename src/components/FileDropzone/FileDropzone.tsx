import { useState, type DragEvent } from "react";
import styles from "./FileDropzone.module.css";

interface FileDropzoneProps {
  fileName: string | null;
  onBrowse: () => void;
  onFileDrop: (file: File) => void;
}

function FileDropzone({ fileName, onBrowse, onFileDrop }: FileDropzoneProps) {
  // UI-only state stays inside the component that needs it
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault(); // required, otherwise the browser won't allow a drop
    setIsDragging(true);
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileDrop(file);
  };

  return (
    <section
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
      aria-label="File upload"
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className={styles.iconBox}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h6" />
        </svg>
      </div>

      <div className={styles.text}>
        <h2 className={styles.title}>{fileName ?? "Drag & drop your file here"}</h2>
        <p className={styles.hint}>
          {fileName ? "Ready to use. Choose another file to replace it." : "or browse your computer to pick a file"}
        </p>
      </div>

      <button type="button" className={styles.browseButton} onClick={onBrowse}>
        Choose file
      </button>
      <span className={styles.meta}>.csv · .htm .html</span>
    </section>
  );
}

export default FileDropzone;