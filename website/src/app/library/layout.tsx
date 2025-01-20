import type { Metadata } from "next";
// import { Average } from "next/font/google";
import "../globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CompSidebar } from "@/components/sidebar/sidebar";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <CompSidebar />
        <SidebarInset className="flex-1">
          <main className="h-full overflow-auto p-4">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
