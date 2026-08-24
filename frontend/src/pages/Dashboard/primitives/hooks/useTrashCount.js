import { useState, useEffect } from 'react';
import { getTrashCount } from '../../../../api/all_api';

let cachedCount = null;
let isFetching = false;

export const useTrashCount = () => {
    const [count, setCount] = useState(cachedCount || 0);

    useEffect(() => {
        if (cachedCount !== null) {
            setCount(cachedCount);
            return;
        }
        if (isFetching) return;
        isFetching = true;
        getTrashCount()
            .then(response => {
                cachedCount = response.data.total || 0;
                setCount(cachedCount);
            })
            .catch(error => {
                console.error('Ошибка получения количества элементов в корзине:', error);
            })
            .finally(() => {
                isFetching = false;
            });
    }, []);

    const refreshCount = async () => {
        try {
            const response = await getTrashCount();
            cachedCount = response.data.total || 0;
            setCount(cachedCount);
        } catch (error) {
            console.error('Ошибка обновления количества элементов в корзине:', error);
        }
    };

    return { count, refreshCount };
};