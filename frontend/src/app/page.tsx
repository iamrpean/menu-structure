import { Home, Database, Cloud, Server, Code, Settings, Link } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen p-8 gap-10 sm:p-20 font-sans">
      <h1 className="flex items-center text-3xl font-bold">
        <Home className="mr-2 h-6 w-6 text-blue-400" />
        Home Page
      </h1>

      <p className="text-lg text-gray-300">
        Welcome to the Home Page! This application is built with modern technologies to deliver a seamless experience.
      </p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-4">
            <Database className="h-8 w-8 text-green-400" />
            <h2 className="text-xl font-semibold">Database</h2>
          </div>
          <p className="text-gray-300">
            Powered by <strong>Supabase</strong>, a scalable and secure PostgreSQL database. Perfect for real-time applications.
          </p>
          <a
            href="https://supabase.io"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            <Link className="mr-2 h-4 w-4" />
            Visit Supabase
          </a>
        </div>

        {/* Backend Card */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-4">
            <Server className="h-8 w-8 text-purple-400" />
            <h2 className="text-xl font-semibold">Backend</h2>
          </div>
          <p className="text-gray-300">
            Hosted on <strong>Railway</strong>, a modern platform for deploying and scaling backend services with ease.
          </p>
          <a
            href="https://railway.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            <Link className="mr-2 h-4 w-4" />
            Visit Railway
          </a>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-4">
            <Cloud className="h-8 w-8 text-yellow-400" />
            <h2 className="text-xl font-semibold">Frontend</h2>
          </div>
          <p className="text-gray-300">
            Deployed on <strong>Vercel</strong>, the best platform for frontend applications with instant deployments and global CDN.
          </p>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            <Link className="mr-2 h-4 w-4" />
            Visit Vercel
          </a>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
            <Code className="h-6 w-6 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold">Modern Tech Stack</h3>
              <p className="text-gray-300">
                Built with Next.js, Tailwind CSS, and TypeScript for a fast and reliable experience.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
            <Settings className="h-6 w-6 text-green-400" />
            <div>
              <h3 className="text-lg font-semibold">Easy Configuration</h3>
              <p className="text-gray-300">
                Pre-configured with Preline plugin for smooth animations and transitions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}