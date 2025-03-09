import { RefObject } from "react";

export const toggleDialog = ({
  ref,
  open,
}: {
  ref: RefObject<HTMLDialogElement>;
  open?: boolean;
}) => {
  const { current: dialog } = ref;
  if (!dialog) return;

  if ((typeof open === "undefined" && !dialog.open) || open) {
    dialog.showModal();
    return;
  }

  if ((typeof open === "undefined" && dialog.open) || open === false) {
    dialog.close();
    return;
  }

  if (dialog.open) {
    dialog.close();
  } else {
    dialog.showModal();
  }
};
