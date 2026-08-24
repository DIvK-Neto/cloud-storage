import { useState, useEffect, useCallback } from 'react';
import { useSettings } from './useSettings';

export const useActionPanelResponsive = (wrapperRef) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const { actionPanelExpanded, toggleActionPanelExpanded } = useSettings();

    useEffect(() => {
        setIsExpanded(actionPanelExpanded);
    }, [actionPanelExpanded]);

    const checkOverflow = useCallback(() => {
        if (wrapperRef.current) {
            const wrapper = wrapperRef.current;
            const twoRowsHeight = 80;
            const isOverflow = wrapper.scrollHeight > twoRowsHeight;
            setIsOverflowing(isOverflow);
        }
    }, [wrapperRef]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            checkOverflow();
        });
        if (wrapperRef.current) {
            resizeObserver.observe(wrapperRef.current);
        }
        checkOverflow();

        return () => {
            resizeObserver.disconnect();
        };
    }, [wrapperRef, checkOverflow]);

    useEffect(() => {
        const handleResize = () => {
            checkOverflow();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [checkOverflow]);

    const toggleExpanded = useCallback(() => {
        toggleActionPanelExpanded();
    }, [toggleActionPanelExpanded]);

    return {
        isOverflowing,
        isExpanded,
        toggleExpanded,
    };
};