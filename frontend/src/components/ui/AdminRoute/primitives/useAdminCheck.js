import { useAuth } from '../../../../hooks/auth/collections/auth';

/**
 * Хук для проверки прав администратора.
 * Возвращает объект с флагами isAuthenticated, isAdmin, loading.
 */
export const useAdminCheck = () => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    return {
        isAuthenticated,
        isAdmin,
        loading,
    };
};