// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./assets/components/layout/layout";
import { routes } from "./assets/components/pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Base layout wraps all your main pages */}
        <Route element={<Layout />}>
          {routes.map(({ path, element: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
