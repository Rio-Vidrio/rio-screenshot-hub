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
      onClick={() => !disabled && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        width: "100%",
        minHeight: "200px",
        border: `1px solid ${dragging ? "#C8A882" : "#D4CEC8"}`,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "border-color 150ms, background 150ms",
        padding: "48px 24px",
        opacity: disabled ? 0.5 : 1,
        background: dragging ? "#FDF9F5" : "#FFFFFF",
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
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "18px",
          color: "#6B6560",
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        Drop a screenshot
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "13px",
          color: "#A39E99",
          textAlign: "center",
          lineHeight: "1.6",
        }}
      >
        Client conversations · Restaurants · Movies · Market stats · Content ideas
      </div>
    </div>
  );
}
