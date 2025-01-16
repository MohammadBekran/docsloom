"use client";

import { EditIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { updateDocument } from "@/features/home/core/actions";

const DocumentInput = ({ documentTitle }: { documentTitle: string }) => {
  const { documentId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(documentTitle);
  const documentTitleInputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      documentTitleInputRef.current &&
      !documentTitleInputRef.current.contains(e.target as Node)
    ) {
      setIsEditing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title === documentTitle) return;

    const document = await updateDocument(documentId as string, title);
    if (document) setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing]);

  return (
    <div className="flex justify-center items-center gap-3">
      {!isEditing && (
        <>
          <span className="text-xl font-bold">{documentTitle}</span>
          <EditIcon
            className="size-5 cursor-pointer"
            onClick={() => setIsEditing(true)}
          />
        </>
      )}
      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            ref={documentTitleInputRef}
            type="text"
            value={title}
            className="outline-none bg-transparent text-xl font-bold lg:text-center"
            onChange={(e) => setTitle(e.target.value)}
          />
        </form>
      )}
    </div>
  );
};

export default DocumentInput;
