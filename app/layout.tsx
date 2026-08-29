import "./globals.css";
import { Exo_2, Bricolage_Grotesque } from "next/font/google";
import { Providers } from "@/components/Providers/providers";

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-exo2",
});

// Display / poster typeface — used only for the oversized heading scale
// (var --font-display). Body copy stays on Exo 2.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-bricolage",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${exo2.variable} ${bricolage.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
