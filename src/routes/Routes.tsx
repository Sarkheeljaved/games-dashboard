import EquationBalanceing from "../pages/EquationBalanceingpage/Homrpage";
import Dashboard from "../dashboard/Dashboard";
import ArmyStrike from "../pages/ArnyStrikePages/HomePage";
import FightPage from "../pages/ArnyStrikePages/FightPage";
import type { FC, ReactElement } from "react";
import DeepoceanAdventure from "../pages/DeepSeaAdventurePages/HomePage";
import StrategyScreen from "../pages/ArnyStrikePages/strategyScreen";
import Equationpage from "../pages/ArnyStrikePages/equationPage";
import SolvingEquation from "../pages/solvingEquation/Homepage";
import PuzzleGame from "../pages/puzzle-gme/HomePage";
import FishInOcean from "../pages/FishInOcean/Homepage";
import EquationBalanceingPhase2 from "../pages/EquationBalanceingPhase2/HomePage";
type RouteElement = FC<any> | (() => ReactElement);

export interface AppRouteType {
  name?: string;
  path: string;
  element: RouteElement;
  children?: AppRouteType[];
}
export const AppRoute: AppRouteType[] = [
  {
    name: "Dashboard",
    path: `/`,
    element: Dashboard,
  },
  {
    name: "Equation-Balanceing",
    path: `/Equation-Balanceing/*`,
    element: EquationBalanceing,
  },
  {
    name: "Equation-Balanceing-Phase2",
    path: `/EquationBalanceingPhase2`,
    element: EquationBalanceingPhase2,
  },
  // Army Strike
  {
    name: "Army Strike",
    path: `/Army-Strike/*`,
    element: ArmyStrike,
  },
  {
    path: "fight-page",
    element: FightPage,
  },
  {
    path: "strategyScreen",
    element: StrategyScreen,
  },
  {
    path: "group/:index",
    element: Equationpage,
  },
  // Army Strike end
  {
    name: "Deep Sea Adventure",
    path: "/Deep-Sea-Adventure/*",
    element: DeepoceanAdventure,
  },
  {
    name: "Solving Equation",
    path: "/Solving-Equation/*",
    element: SolvingEquation,
  },
  {
    name: "Puzzle Game",
    path: "/Puzzle-Game/*",
    element: PuzzleGame,
  },
  {
    name: "Fish In Ocean",
    path: "/Fish-In-Ocean/*",
    element: FishInOcean,
  },
];
