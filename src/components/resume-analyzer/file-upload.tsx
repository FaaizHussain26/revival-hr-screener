import React, { useCallback } from "react";

import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  disabled,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
      },
      maxFiles: 1,
      disabled,
    });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
        isDragActive ? "border-primary bg-primary/5" : "border-border",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:border-primary hover:bg-primary/5"
      )}
    >
      <input {...getInputProps()} />

      <div className="space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-background rounded-full border">
          <Upload className="w-6 h-6 text-muted-foreground" />
        </div>

        {isDragActive ? (
          <div>
            <p className="text-lg font-medium text-primary">
              Drop the resume here
            </p>
            <p className="text-sm text-muted-foreground">Release to upload</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium">
              Drop resume here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, DOC, and DOCX files up to 10MB
            </p>
          </div>
        )}

        {acceptedFiles.length > 0 && (
          <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-lg">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {acceptedFiles[0].name}
            </span>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          disabled={disabled}
        >
          Choose File
        </Button>
      </div>
    </div>
  );
};
