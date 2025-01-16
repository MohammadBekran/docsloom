import Image from "next/image";
import Link from "next/link";

import DeleteDocumentModal from "@/features/documents/components/document/delete-document-modal";
import { getDocuments } from "@/features/documents/core/actions";

import { dateFormatter } from "@/lib/utils";

const DocumentsList = async () => {
  const documents = await getDocuments();

  return (
    <ul className="w-full flex flex-col gap-y-5 mt-10">
      {(documents?.data.length ?? 0) > 0 ? (
        <p className="text-lg text-center text-muted">No documents found</p>
      ) : (
        documents?.data.map(({ id, createdAt, metadata: { title } }) => {
          const formattedDate = dateFormatter(createdAt.toString());

          return (
            <li
              key={id}
              className="w-full rounded-md shadow-xl p-5 bg-[url('/background-image.png')] bg-cover"
            >
              <Link
                href={`/documents/${id}`}
                className="w-full flex items-center gap-x-4"
              >
                <div className="hidden rounded-md p-2 bg-dark-500 sm:block">
                  <Image
                    src="/document.svg"
                    alt="Document"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-lg line-clamp-1">{title}</span>
                    <span className="text-sm font-light text-blue-100">
                      {formattedDate}
                    </span>
                  </div>
                  <div>
                    <DeleteDocumentModal documentId={id} />
                  </div>
                </div>
              </Link>
            </li>
          );
        })
      )}
    </ul>
  );
};

export default DocumentsList;
