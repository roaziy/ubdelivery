import Header from "@/components/header/Header";
import SetupContent from "@/components/setup/SetupContent";

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-backgroundGreen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <SetupContent />
      </main>
    </div>
  );
}
