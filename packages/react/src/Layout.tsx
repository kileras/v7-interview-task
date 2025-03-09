import { FC, useLayoutEffect } from "react";
import { Outlet } from "react-router";
import styles from "./Layout.module.css";
import { useMatchMedia } from "./hooks/useMatchMedia";
import { AskGoButton } from "./components/AskGo";

const Layout: FC = () => {
  const isDarkMode = useMatchMedia({
    query: "(prefers-color-scheme: dark)",
    defaultValue: false,
  });

  useLayoutEffect(() => {
    document.body.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  return (
    <>
      <AskGoButton />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
