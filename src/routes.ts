import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import {
    ADD_BROKEN_ROBOT,
    CREATE_OPTION,
    HOME_ROUTE,
    SIGN_IN_ROUTE,
    TOTE_INFO_ROUTE,
    UNIQ_NUMBER_ROUTE
} from "./utils/const";
import CreateOption from "./pages/CreateOption/CreateOption";
import ToteInfo from "./pages/Tote/ToteInfo/ToteInfo";
import UniqNumber from "./pages/UniqNumber/UniqNumber";
import AddBroken from "./pages/Robots/AddBroken/AddBroken";


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
];