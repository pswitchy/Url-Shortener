// pages/_app.tsx (example if it already exists)
import '../styles/globals.css'; // Add the import here
import React from 'react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;