import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const viewport: Viewport = {
    themeColor: [
        { color: "#4c5dab", media: "(prefers-color-scheme: light)" },
        { color: "#4c5dab", media: "(prefers-color-scheme: dark)" },
    ],
};
const siteConfig = {
    name: "Devi | Asistente de Devanthos",
    description: "Asistente virtual para consultas y soporte en Devanthos",
};

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ["Devanthos", "Devi", "Asistente Virtual"],
    icons: {
        icon: "/favicon.svg",
        apple: "/favicon.svg",
        shortcut: "/favicon.svg",
    },
    // manifest: "/manifest.json",
    creator: "Juan Morales",
    // openGraph: {
    //     title: siteConfig.name,
    //     description: siteConfig.description,
    //     url: "https://pichirika.com",
    //     siteName: "PichiriKa",
    //     images: [
    //         {
    //             url: "https://pichirika.com/Metadata.jpg",
    //             width: 1200,
    //             height: 630,
    //         },
    //     ],
    //     locale: "es_AR",
    //     type: "website",
    // },
    // twitter: {
    //     card: "summary_large_image",
    //     title: siteConfig.name,
    //     description: siteConfig.description,
    //     siteId: "1467726470533754880",
    //     creator: "@Juanmora1810",
    //     creatorId: "1467726470533754880",
    //     images: ["https://pichirika.com/Metadata.jpg"],
    // },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen dark w-full relative`}
            >
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
                            radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
                            radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
                            radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%)
                            `,
                    }}
                />

                {children}
            </body>
        </html>
    );
}
