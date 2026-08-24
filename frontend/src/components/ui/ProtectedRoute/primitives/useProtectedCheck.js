import { useAuth } from '../../../../hooks/auth/collections/auth';

/**
 * Хук для проверки авторизации.
 * Возвращает объект с флагами isAuthenticated и loading.
 */
export const useProtectedCheck = () => {
    const { isAuthenticated, loading } = useAuth();

    return {
        isAuthenticated,
        loading,
    };
};