import { Dashboard, Profile } from '../../pages/all_pages';
import { ProtectedRoute } from '../../components/all_components';

export const privateRouting = [
    {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    },
    {
        path: '/profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
    },
];