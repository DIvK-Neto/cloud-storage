import React from 'react';
import { Navigate } from 'react-router-dom';
import { allRouting as routes } from './collections/routing';
import SharedFileView from '../pages/shared/SharedFileView';
import SharedCollectionView from '../pages/shared/SharedCollectionView';
import { Trash } from '../pages/Trash/collections/components';       // <-- добавить
import { ProtectedRoute } from '../components/ui/ProtectedRoute/collections/protectedRoute'; // <-- добавить

export const allRouting = [
    // Публичные маршруты для ссылок
    { path: '/shared/:uuid', element: <SharedFileView /> },
    { path: '/shared/collection/:uuid', element: <SharedCollectionView /> },
    // Маршрут для корзины (только для авторизованных)
    { path: '/trash', element: <ProtectedRoute><Trash /></ProtectedRoute> }, // <-- добавить
    // Остальные маршруты из сборщика
    ...routes,
    // Редирект для всех остальных
    { path: '*', element: <Navigate to="/" replace /> },
];