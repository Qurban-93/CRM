import { lazy } from "react";

const LoginPage = lazy(() => import("../pages/loginPage/LoginPage"));
const ForgotPasswordPage = lazy(() => import("../pages/forgotPasswordPage/ForgotPasswordPage"));

const routes = [
    {
        path: '/',
        element: <LoginPage />
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />
    }
]

export default routes;