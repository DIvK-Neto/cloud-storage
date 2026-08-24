import React from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useFieldTooltip } from '../collections/smartField';

export const TooltipIcon = ({ text, placement = 'top' }) => {
    const { visible, open, close } = useFieldTooltip();

    if (!text) return null;

    return (
        <Tooltip
            title={<div style={{ whiteSpace: 'pre-line' }}>{text}</div>}
            placement={placement}
            open={visible}
            onOpenChange={(isVisible) => {
                if (isVisible) open();
                else close();
            }}
        >
            <QuestionCircleOutlined
                style={{
                    marginLeft: 8,
                    color: '#1890ff',
                    cursor: 'pointer',
                    fontSize: 16,
                }}
            />
        </Tooltip>
    );
};