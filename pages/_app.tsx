import "@/styles/globals.css";
import '@mantine/core/styles.css';
import type { AppProps } from "next/app";
import { createTheme, MantineProvider } from '@mantine/core';
import {HeroUIProvider} from '@heroui/react'

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <HeroUIProvider>
        <Component {...pageProps} />
      </HeroUIProvider>
    </MantineProvider>
  );
}
