import { AdminPanel } from '../../pages/all_pages';
import { AdminRoute } from '../../components/all_components';

export const adminRouting = [
    {
        path: '/admin',
        element: <AdminRoute><AdminPanel /></AdminRoute>,
    },
];