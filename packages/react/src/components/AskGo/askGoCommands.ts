import { NavigateFunction, Params } from "react-router";

// NOTE: Made up a couple of actions here to showcase how a structure like this can be used to build up a series of commands
// Those commands can potentially be owned by the different areas/components/etc and then combine to build the list of available
// options

export enum CommandOptionType {
  POPOVER = "propover",
  NAVIGATION = "navigation",
}
export interface CommandOption {
  id: string;
  text: string | ((text: string) => string);
  action: (data: {
    params: Params<string>;
    navigate: NavigateFunction;
  }) => Promise<void>;
}

export const CommandOptions: CommandOption[] = [
  {
    id: "help-me",
    text: "Help me setup my project",
    action: async ({ params, navigate }) => {
      return navigate(`/${params.workspaceId}/projects/${params.projectId}`);
    },
  },
  {
    id: "data-extract",
    text: "I want to extract some data",
    action: async ({ params, navigate }) => {
      return navigate(`/${params.workspaceId}/projects/${params.projectId}`);
    },
  },
  {
    id: "create-property",
    text: "Create a new property",
    action: async ({ params, navigate }) => {
      await navigate(`/${params.workspaceId}/projects/${params.projectId}`, {
        // NOTE: This bit is the one that help us guarantee that by the time this returns the DOM will be updated
        // See `App.tsx` for the changes in the router
        flushSync: true,
      });

      const element = document.getElementById("property-list");

      if (!element) {
        // FIMXE: Maybe add better error handling here instead of doing noth9ing and logging
        console.error("Trigerred new property but element can't be found");
        return;
      }

      element.showPopover();
    },
  },
  {
    id: "talk",
    text: "Open a conversation",
    action: async ({ params, navigate }) => {
      return navigate(`/${params.workspaceId}/projects/${params.projectId}`);
    },
  },
];

// NOTE: This the command we use when we filter and there are not suggestions
export const DefaultCommandOption: CommandOption = {
  id: "ask",
  text: (text) => `Ask Go  "${text}"`,
  action: async ({ params, navigate }) => {
    return navigate(`/${params.workspaceId}/projects/${params.projectId}`);
  },
};
