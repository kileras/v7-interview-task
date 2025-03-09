import styles from "./askGoButton.module.css";
import { useEffect, useRef } from "react";
import AskGoIcon from "./AskGoIcon";
import AskGoDialog from "./AskGoDialog";
import { toggleDialog } from "./utils/toggleDialog";

export const AskGoButton = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // NOTE: Here I was tempted to use https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/platform but seems a bit early :P
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "k" &&
        ((isMac && event.metaKey) || (!isMac && event.ctrlKey))
      ) {
        toggleDialog({ ref: dialogRef });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMac]);

  const handleButtonClick = () => {
    toggleDialog({ ref: dialogRef, open: true });
  };

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={handleButtonClick}
      >
        <AskGoIcon />
        <p>Ask Go</p>
        <div className={styles.shortcuts}>
          <span>{isMac ? "⌘" : "Ctrl"}</span>
          <span>K</span>
        </div>
      </button>
      <AskGoDialog ref={dialogRef} />
    </>
  );
};

export default AskGoButton;
