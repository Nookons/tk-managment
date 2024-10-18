import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import {HOME_ROUTE, SIGN_IN_ROUTE} from "./utils/const";


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
];