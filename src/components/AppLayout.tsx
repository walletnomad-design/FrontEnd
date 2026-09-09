import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AiChatWidget } from "./AiChatWidget";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <AiChatWidget />
    </div>
  );
}