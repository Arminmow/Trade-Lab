import { useRef, useState, type ChangeEvent } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./Dashboard.module.css";
import FileDropzone from "../../components/FileDropzone/FileDropzone";

const ACCEPTED_TYPES = ".csv,.htm,.html";

function Dashboard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const openFilePicker = () => inputRef.current?.click();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) setFile(picked);
    e.target.value = ""; 
  };

  return (
    <div className={styles.dashboard}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleInputChange}
        hidden
      />

      <Sidebar onUploadClick={openFilePicker} />

      <main className={styles.main}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Dashboard</span>
          <h1 className={styles.title}>Upload your trading data</h1>
          <p className={styles.subtitle}>
            Add a file to start exploring your trades. Your charts and metrics will show up here.
          </p>
        </header>

        <FileDropzone fileName={file?.name ?? null} onBrowse={openFilePicker} onFileDrop={setFile} />
      </main>
    </div>
  );
}

export default Dashboard;