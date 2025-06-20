import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AppRoute } from "./routes/Routes";
import "./App.css";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Routes>
          {AppRoute.map((route, index) => (
            <Route key={index} path={route.path} element={<route.element />}>
              {route.children?.map((child, childIndex) => (
                <Route
                  key={`${index}-${childIndex}`}
                  path={child.path}
                  element={<child.element />}
                />
              ))}
            </Route>
          ))}
        </Routes>
      </BrowserRouter>
    </DndProvider>
  );
}

export default App;