import CreateDocumentButton from "@/features/home/components/create-document-button";
import DocumentsList from "@/features/home/components/documents-list";
import Header from "@/features/home/components/header";

const Home = () => {
  return (
    <main className="w-full min-h-screen flex flex-col items-center gap-5 sm:gap-10">
      <Header />
      <div className="w-full max-w-[770px] flex flex-col items-center px-7 pb-10">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-[28px] font-semibold">All Documents</h1>
          <CreateDocumentButton />
        </div>
        <DocumentsList />
      </div>
    </main>
  );
};

export default Home;
