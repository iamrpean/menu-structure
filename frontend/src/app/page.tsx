import { Home } from "lucide-react"; 

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen p-8 gap-10 sm:p-20 font-sans">
      <h1 className="flex items-center text-3xl font-bold">
        <Home className="mr-2 h-6 w-6 text-blue-400" />
        Home Page
      </h1>
      <p className="text-lg text-gray-300">This is the Home Page</p>
    </div>
  );
}
