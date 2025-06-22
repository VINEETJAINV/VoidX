import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="description" content="VOIDX - The next-gen social platform. Share, connect, and express yourself with a beautiful, modern experience." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta property="og:title" content="VOIDX" />
        <meta property="og:description" content="The next-gen social platform. Share, connect, and express yourself with a beautiful, modern experience." />
        <meta property="og:image" content="/vercel.svg" />
        <meta property="og:type" content="website" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
