"use client";

import { useRef, useState } from "react";

interface UploadZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFile, disabled }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    onFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={disabled ? "" : "upload-pulse"}
      onClick={() => !disabled && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        width: "100%",
        minHeight: "200px",
        border: `2px dashed ${dragging ? "#f0a500" : "#2a2a2a"}`,
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "border-color 150ms",
        padding: "40px 24px",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
        disabled={disabled}
      />
      <div
        style={{
          fontSize: "32px",
          marginBottom: "12px",
          opacity: 0.4,
        }}
      >
        ⬆
      </div>
      <div
        style={{
          fontSize: "15px",
          color: "#888",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        Drop any screenshot
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "#444",
          marginTop: "6px",
          textAlign: "center",
        }}
      >
        or click to browse — PNG, JPG, WEBP
      </div>
    </div>
  );
}
