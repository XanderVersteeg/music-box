import { QueryClientProvider } from "@/components/query-client-provider";

export default function DynamicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryClientProvider>{children}</QueryClientProvider>;
}
