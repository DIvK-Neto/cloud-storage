import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../../../hooks/all_hooks";
import { allMenu } from "../../../../../config/all_config";

export const useNavbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin, user, logout } = useAuth();

    let menuItems = [];
    if (!isAuthenticated) {
        menuItems = allMenu.publicMenu || [];
    } else if (isAdmin) {
        menuItems = allMenu.adminMenu || [];
    } else {
        menuItems = allMenu.privateMenu || [];
    }

    const handleMenuClick = (key) => {
        if (key === '/logout') {
            handleLogout();
        } else {
            navigate(key);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return { isAuthenticated, user, menuItems, handleMenuClick, handleLogout };
};