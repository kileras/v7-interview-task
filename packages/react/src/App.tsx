import "./assets/main.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router";
import { ProjectTable } from "./components/ProjectTable";
import { EntityView } from "./components/EntityView";
import { FallbackPage } from "./components/FallbackPage";
import { ProjectProvider } from "./contexts/Project/ProjectProvider";
import Layout from "./Layout";
import { RouterProvider } from "react-router-dom";

// NOTE: I ended up changing this to a data route since it is required to support `flushSync` when using `navigate`.
// That is needed in order to be able to trigger the popover from AskGo if you are not in the route where it lives.
// This allows the router to do teh navigation synchronously and guarantee that when navigate returns the DOM is updated
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Layout />}>
        <Route path="/:workspaceId/projects/:projectId">
          {/* Table view (index route) */}
          <Route
            index
            element={
              <ProjectProvider>
                <ProjectTable />
              </ProjectProvider>
            }
          />

          {/* Entity view */}
          <Route
            path="entities/:entityId"
            element={
              <ProjectProvider>
                <EntityView />
              </ProjectProvider>
            }
          />
        </Route>
        {/* Fallback route */}
        <Route path="*" element={<FallbackPage />} />
      </Route>
    </>
  )
);

function App() {
  console.log(import.meta.env);

  return <RouterProvider router={router} />;
}

export default App;
