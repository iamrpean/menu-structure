"use client";

import "../styles/globals.css";

import { Provider, useSelector } from "react-redux";
import { store, RootState } from "../store/store";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Provider store={store}>
      <LayoutContent>{children}</LayoutContent>
    </Provider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);

  return (
    <html lang="en">
      <body className="flex bg-darkBg text-white min-h-screen">
        <Sidebar />

        <main
          className={cn("flex-1 p-4 transition-all", isSidebarOpen ? "sm:ml-64":"")}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
