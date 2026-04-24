import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DWA Union",
  description: "Dairy Workers Association Member App",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0d0b08" }}>
        {children}
      </body>
    </html>
  );
}
