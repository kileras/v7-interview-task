import { useEffect, useRef } from "react";
import styles from "./addPropertyButton.module.css";

// NOTE: React hasn't caught yet with Popover it seems, at least in 18
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface HTMLAttributes<T> {
    popover?: string;
    popovertarget?: string;
  }
}

const FieldTypes = [
  {
    name: "Text",
  },
  {
    name: "File",
  },
  {
    name: "Number",
  },
  {
    name: "Collection",
  },
  {
    name: "Single Select",
  },
  {
    name: "Multi Select",
  },
  {
    name: "URL",
  },
  {
    name: "Reference",
  },
  {
    name: "JSON",
  },
  {
    name: "Page Splitter",
  },
];

// NOTE: onToggle is not a thing in React as of 18 (again maybe it is in 19) so I needed to do it manually
// Now if I do it manually the event is generic so ended up butchering the type to make it work 😅
const onListToggle = (event: Event) => {
  // NOTE: Followingf on the note I added in `AskGoDialog.tsx` this is the place where `newState` was coming with `closed`
  // even if I call `showDialog` and check the open state with CSS via the `matches` method. It seems to work now but that is a weird one
  if ((event as Event & { newState: string }).newState !== "open") return;

  const element = event.currentTarget as HTMLUListElement;
  element.querySelector("button")?.focus();
};

export const AddPropertyButton = () => {
  const propListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!propListRef.current) return;

    const list = propListRef.current;
    list.addEventListener("toggle", onListToggle);

    return () => {
      list.removeEventListener("toggle", onListToggle);
    };
  }, [propListRef]);

  return (
    <>
      <button
        type="button"
        popovertarget="property-list"
        className={styles.button}
      >
        +
      </button>
      {/* NOTE: Sadly no offset seemingly in anchor API so I needed an extra div */}
      <div
        id="property-list"
        popover="auto"
        className={styles.propertiesList}
        ref={propListRef}
      >
        <ul>
          {FieldTypes.map(({ name }) => {
            return (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => {
                    console.warn(
                      `Adding property "${name}" is not implemented`
                    );
                    propListRef?.current?.togglePopover(false);
                  }}
                >
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default AddPropertyButton;
