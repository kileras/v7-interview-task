import { useNavigate, useParams } from "react-router-dom";
import styles from "./askGoDialog.module.css";
import {
  KeyboardEvent,
  MouseEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import AskGoIcon from "./AskGoIcon";
import {
  CommandOption,
  CommandOptions,
  DefaultCommandOption,
} from "./askGoCommands";

export const AskGoDialog = forwardRef<HTMLDialogElement>((_, dialogRef) => {
  const params = useParams();
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const [options, setOptions] = useState<CommandOption[]>(CommandOptions);
  const [currentOption, setCurrentOption] = useState<number>(0);

  // NOTE: At some point I had this debounced (the hook is still around) but it felt overkill for this scenario
  // and the experience feels more responsive so I decide to remove it
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const words = inputValue.split(/\s+/);

    const newOptions = CommandOptions.filter((option) => {
      // NOTE: We filter out any option that doesn't have a plain text to avoid searching over the search term
      if (typeof option.text === "function") return;

      return words.every((word) =>
        (option.text as string).toLowerCase().includes(word)
      );
    });

    setOptions(newOptions.length ? newOptions : [DefaultCommandOption]);
    setCurrentOption(
      Math.max(
        Math.min(currentOption, newOptions.length ? newOptions.length - 1 : 0),
        0
      )
    );
    // NOTE: We don't really care at this point if currentOption has changed so no need to include it in the array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const handleCloseClick = () => {
    if (dialogRef && "current" in dialogRef) {
      (dialogRef.current as HTMLDialogElement).close();
    }
  };

  /**
   * Handle clicks withing the dialog so if we get a click for the dialog itself we can close it since
   * that only happens if the user clicks the actual element (which shouldn't really be possible wiht the content)
   * or the backdrop
   */
  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target instanceof HTMLDialogElement) {
      event.target.close();
    }
  };

  /**
   * Handle the closing of the dialog so we can go ahead and reset everything
   */
  const handleDialogClose = () => {
    setCurrentOption(0);
    setOptions(CommandOptions);

    if (!inputRef.current) return;
    inputRef.current.value = "";
  };

  /**
   * The input is uncontrolled but we do this to allow users to select an commnad while the focus in in the input
   * */
  const handleInputKeydown = async (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        setCurrentOption(
          Math.min(Math.max(0, currentOption - 1), options.length - 1)
        );
        break;
      case "ArrowDown":
        event.preventDefault();
        setCurrentOption(
          Math.min(Math.max(0, currentOption + 1), options.length - 1)
        );
        break;
      case "Enter":
        event.preventDefault();
        // NOTE: Ok this one is quite innteresitng, I need a better repro scenario to raise a crbug, it seems that in some scenarios
        // the fact that we are in a keydown event context is messing up wiht the popover. When I use enter to select an option and then
        // trigger the popover it calls `showPopover` and seemingly updates (if you check with matches) but the toggle event I get in
        // the popover itself comes with `newState` false. I'm not sure but its almost like the keydown is still happening so it trigger
        // the logic to close the popover as I'm trying to open it. This does not happen ever if I use the mouse so I tried setTImeout to
        // pull the logic out of the event context and it seemingly does the trick.
        setTimeout(() => handleOptionSelected(options[currentOption]));
        break;
    }
  };

  const handleOptionSelected = async (option: CommandOption) => {
    await option.action({ params, navigate });
    handleCloseClick();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={handleDialogClose}
      onClick={handleDialogClick}
      data-theme="dark"
    >
      <div className={styles.text}>
        <AskGoIcon />
        <input
          type="text"
          placeholder="What do you want to do?"
          ref={inputRef}
          onKeyDown={handleInputKeydown}
          onChange={(e) => setInputValue(e.currentTarget.value)}
        />
        <button type="button" onClick={handleCloseClick}>
          x
        </button>
      </div>
      <p className={styles.suggestionsTitle}>Suggestions</p>
      <ul className={styles.suggestionsList}>
        {options.map((option, index) => {
          return (
            <li
              key={option.id}
              className={currentOption === index ? styles.activeOption : ""}
              onMouseOver={() => setCurrentOption(index)}
              onClick={() => handleOptionSelected(option)}
            >
              <button type="button">
                {typeof option.text === "function"
                  ? option.text(inputValue)
                  : option.text}
              </button>
            </li>
          );
        })}
      </ul>
    </dialog>
  );
});

export default AskGoDialog;
