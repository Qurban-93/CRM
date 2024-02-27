import { Route, Routes } from "react-router-dom";
import { lazy } from "react";


const RaportPage = lazy(() => import("./raportsPage/RaportPage"));
const UsersPage = lazy(() => import("../pages/usersPage/UsersPage"));
const TeamsPage = lazy(() => import("../pages/teamsPage/TeamsPage"));
const ProjectPage = lazy(() => import("../pages/projectsPage/ProjectPage"));


const PrivateRouter = ({ role }) => {
    const check = role === 'Employee';
    const objConditional = {
        "Others": <Routes>
            <Route element={<RaportPage />} path='/raports' />
            <Route element={<UsersPage />} path='/' />
            <Route element={<TeamsPage />} path='/teams' />
            <Route element={<ProjectPage />} path='/projects' />
        </Routes>,
        "Employee": <Routes>
            <Route element={<RaportPage />} path='/' />
        </Routes>,
    }
    return objConditional[check ? 'Employee' : 'Others']
}

export default PrivateRouter;

