import Document from "@/features/documents/components/document";

const DocumentPage = async ({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) => {
  const { documentId } = await params;

  return <Document documentId={documentId} />;
};

export default DocumentPage;
