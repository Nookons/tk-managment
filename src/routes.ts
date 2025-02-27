import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import {
    ADD_BROKEN_ROBOT,
    HOME_ROUTE, PARTS_INFO_ROUTE, REPORT_REFACTOR, ROBOT_ASSETS, ROBOTS_DISPLAY,
    SIGN_IN_ROUTE, SINGLE_ROBOT, SINGLE_TASK, TOTE_DISPLAY,
    TOTE_INFO_ROUTE,
    UNIQ_NUMBER_ROUTE, USER_PROFILE, WORK_STATION_DISPLAY
} from "./utils/const";
import ToteInfo from "./pages/Tote/ToteInfo/ToteInfo";
import UniqNumber from "./pages/UniqNumber/UniqNumber";
import AddBroken from "./pages/Robots/AddBroken/AddBroken";
import RobotsDisplay from "./pages/Robots/RobotsDisplay/RobotsDisplay";
import WorkStationDisplay from "./pages/WorkStation/Display/WorkStationDisplay";
import SingleRobot from "./pages/Robots/Single/SingleRobot";
import ToteDisplay from "./pages/Tote/ToteDisplay/ToteDisplay";
import Profile from "./pages/User/Profile";
import Task from "./pages/Task/Task";
import Report from "./pages/Report/Report";
import PartsInfo from "./pages/Info/PartsInfo";
import RobotAssets from "./pages/RobotAssets/RobotAssets";


interface Route {
    path: string;
    Component: React.ComponentType<any>;
    label?: string;
}

type PublicRoutes = Route[];

// routes for users
export const publicRoutes: PublicRoutes = [
    {
        path: HOME_ROUTE,
        Component: Home,
    },
    {
        path: SIGN_IN_ROUTE,
        Component: SignIn,
    },
    {
        path: TOTE_INFO_ROUTE,
        Component: ToteInfo,
    },
    {
        path: UNIQ_NUMBER_ROUTE,
        Component: UniqNumber,
    },
    {
        path: ADD_BROKEN_ROBOT,
        Component: AddBroken,
    },
    {
        path: ROBOTS_DISPLAY,
        Component: RobotsDisplay,
    },
    {
        path: WORK_STATION_DISPLAY,
        Component: WorkStationDisplay,
    },
    {
        path: SINGLE_ROBOT,
        Component: SingleRobot,
    },
    {
        path: TOTE_DISPLAY,
        Component: ToteDisplay,
    },
    {
        path: USER_PROFILE,
        Component: Profile,
    },
    {
        path: SINGLE_TASK,
        Component: Task,
    },
    {
        path: REPORT_REFACTOR,
        Component: Report,
    },
    {
        path: PARTS_INFO_ROUTE,
        Component: PartsInfo,
    },
    {
        path: ROBOT_ASSETS,
        Component: RobotAssets,
    },
];