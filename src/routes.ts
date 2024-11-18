import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import {
    ADD_BROKEN_ROBOT,
    CREATE_OPTION, ERROR_TRANSLATION,
    HOME_ROUTE, ROBOTS_DISPLAY,
    SIGN_IN_ROUTE, SINGLE_ROBOT, TOTE_DISPLAY,
    TOTE_INFO_ROUTE,
    UNIQ_NUMBER_ROUTE, WORK_STATION_DISPLAY
} from "./utils/const";
import CreateOption from "./pages/CreateOption/CreateOption";
import ToteInfo from "./pages/Tote/ToteInfo/ToteInfo";
import UniqNumber from "./pages/UniqNumber/UniqNumber";
import AddBroken from "./pages/Robots/AddBroken/AddBroken";
import RobotsDisplay from "./pages/Robots/RobotsDisplay/RobotsDisplay";
import WorkStationDisplay from "./pages/WorkStation/Display/WorkStationDisplay";
import ErrorsTranslation from "./pages/ErrorsTranslation/ErrorsTranslation";
import SingleRobot from "./pages/Robots/Single/SingleRobot";
import ToteDisplay from "./pages/Tote/ToteDisplay/ToteDisplay";


interface Route {
    path: string;
    Component: React.ComponentType<any>;
    label: string;
}

type PublicRoutes = Route[];

// routes for users
export const publicRoutes: PublicRoutes = [
    {
        path: HOME_ROUTE,
        Component: Home,
        label: 'Home',
    },
    {
        path: SIGN_IN_ROUTE,
        Component: SignIn,
        label: 'SignIn',
    },
    {
        path: CREATE_OPTION,
        Component: CreateOption,
        label: 'Create Option',
    },
    {
        path: TOTE_INFO_ROUTE,
        Component: ToteInfo,
        label: 'Tote Info',
    },
    {
        path: UNIQ_NUMBER_ROUTE,
        Component: UniqNumber,
        label: 'Uniq Number',
    },
    {
        path: ADD_BROKEN_ROBOT,
        Component: AddBroken,
        label: 'Add Broken',
    },
    {
        path: ROBOTS_DISPLAY,
        Component: RobotsDisplay,
        label: 'Add Broken',
    },
    {
        path: WORK_STATION_DISPLAY,
        Component: WorkStationDisplay,
        label: 'Work Station Display',
    },
    {
        path: ERROR_TRANSLATION,
        Component: ErrorsTranslation,
        label: 'Errors Translation',
    },
    {
        path: SINGLE_ROBOT,
        Component: SingleRobot,
        label: 'Single Robot',
    },
    {
        path: TOTE_DISPLAY,
        Component: ToteDisplay,
        label: 'Tote Display',
    },
];