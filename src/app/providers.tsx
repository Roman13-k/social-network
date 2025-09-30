"use client";
import { makeStore } from "@/store/store";
import { ThemeProvider } from "next-themes";
import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={makeStore()}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </Provider>
  );
}
