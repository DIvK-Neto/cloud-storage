import { Home, Login, Register } from '../../pages/all_pages';

export const publicRouting = [
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
];