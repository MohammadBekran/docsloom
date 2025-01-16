import type { Metadata } from "next";

import Document from "@/features/documents/components/document";
import { getDocument } from "@/features/documents/core/actions";

interface IDocumentPageProps {
  params: Promise<{ documentId: string }>;
}

const DocumentPage = async ({ params }: IDocumentPageProps) => {
  const { documentId } = await params;

  return <Document documentId={documentId} />;
};

export const generateMetadata = async ({
  params,
}: IDocumentPageProps): Promise<Metadata> => {
  const { documentId } = await params;

  const document = await getDocument(documentId);
  const documentTitle = document?.metadata.title as string;

  return {
    title: documentTitle,
    description:
      "In this page you can access your editor and write everything you want",
  };
};

export default DocumentPage;
