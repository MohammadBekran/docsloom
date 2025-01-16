import Header from "@/features/home/components/header";
import CreateDocumentButton from "@/features/home/components/create-document-button";

const Home = () => {
  return (
    <main className="w-full min-h-screen flex flex-col items-center gap-5 sm:gap-10">
      <Header />
      <div className="w-full flex flex-col items-center px-7">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-2xl">All Documents</h1>
          <CreateDocumentButton />
        </div>
      </div>
    </main>
  );
};

export default Home;
