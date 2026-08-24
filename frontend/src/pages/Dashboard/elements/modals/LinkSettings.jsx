import React from 'react';
import { Radio, Button, Input, DatePicker, Tooltip, Typography, Checkbox, message, Space } from 'antd';
import { ClockCircleOutlined, CopyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

export const LinkSettings = ({
    // Тип ссылки (только для создания)
    showLinkType = false,
    linkType,
    setLinkType,

    // Срок действия
    expirationType,
    setExpirationType,
    customDays,
    setCustomDays,
    expirationDate,
    setExpirationDate,

    // Время
    timeType,
    setTimeType,
    customTime,
    setCustomTime,
    hasDateSelected,

    // Доступ
    allowDownload,
    setAllowDownload,

    // Пароль (новые пропсы)
    passwordViewEnabled,
    setPasswordViewEnabled,
    passwordDownloadEnabled,
    setPasswordDownloadEnabled,
    passwordView,
    setPasswordView,
    passwordDownload,
    setPasswordDownload,
}) => {
    const isAlways = expirationType === 'always';

    const handleExpirationClick = (type) => {
        setExpirationType(prev => (prev === type ? null : type));
    };

    // 🔥 НОВЫЙ ОБРАБОТЧИК ДЛЯ ВРЕМЕНИ (toggle)
    const handleTimeClick = (type) => {
        if (isAlways) return; // если бессрочно, ничего не делаем
        setTimeType(prev => (prev === type ? null : type));
    };

    const copyPassword = (password) => {
        if (password) {
            navigator.clipboard.writeText(password);
            message.success('Пароль скопирован');
        }
    };

    // Преобразуем expirationDate в dayjs объект для DatePicker
    const datePickerValue = expirationDate ? dayjs(expirationDate) : null;

    return (
        <div style={{ padding: '8px 0' }}>
            {/* Тип ссылки (только для создания) */}
            {showLinkType && (
                <div style={{ marginBottom: 16 }}>
                    <Text strong>Тип ссылки</Text>
                    <div style={{ marginTop: 8 }}>
                        <Radio.Group value={linkType} onChange={(e) => setLinkType(e.target.value)}>
                            <Radio value="common">Общая ссылка на все элементы</Radio>
                            <Radio value="individual">Отдельные ссылки для каждого элемента</Radio>
                        </Radio.Group>
                    </div>
                </div>
            )}

            {/* Срок действия */}
            <div style={{ marginBottom: 16 }}>
                <Text strong>📅 Срок действия</Text>
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <Tooltip title="Срок действия ссылки">
                        <Button
                            type={expirationType === '1day' ? 'primary' : 'default'}
                            onClick={() => handleExpirationClick('1day')}
                        >
                            1 день
                        </Button>
                    </Tooltip>
                    <Tooltip title="Срок действия ссылки">
                        <Button
                            type={expirationType === '3days' ? 'primary' : 'default'}
                            onClick={() => handleExpirationClick('3days')}
                        >
                            3 дня
                        </Button>
                    </Tooltip>
                    <Tooltip title="Срок действия ссылки">
                        <Button
                            type={expirationType === '7days' ? 'primary' : 'default'}
                            onClick={() => handleExpirationClick('7days')}
                        >
                            7 дней
                        </Button>
                    </Tooltip>
                    <Tooltip title="Бессрочная ссылка">
                        <Button
                            type={expirationType === 'always' ? 'primary' : 'default'}
                            onClick={() => handleExpirationClick('always')}
                        >
                            Всегда
                        </Button>
                    </Tooltip>
                    <Tooltip title="Укажите количество дней">
                        <Button
                            type={expirationType === 'custom' ? 'primary' : 'default'}
                            onClick={() => handleExpirationClick('custom')}
                        >
                            Вручную
                        </Button>
                    </Tooltip>
                    <Tooltip title="Выберите конкретную дату">
                        <Button
                            type={expirationType === 'date' ? 'primary' : 'default'}
                            onClick={() => handleExpirationClick('date')}
                        >
                            До даты
                        </Button>
                    </Tooltip>
                </div>
                {expirationType === 'custom' && (
                    <div style={{ marginTop: 8 }}>
                        <Input
                            placeholder="Количество дней"
                            type="number"
                            min={1}
                            value={customDays}
                            onChange={(e) => setCustomDays(e.target.value)}
                            style={{ width: 200 }}
                        />
                    </div>
                )}
                {expirationType === 'date' && (
                    <div style={{ marginTop: 8 }}>
                        <DatePicker
                            placeholder="Выберите дату"
                            value={datePickerValue}
                            onChange={(date) => {
                                setExpirationDate(date ? date.toISOString() : null);
                            }}
                            style={{ width: 200 }}
                        />
                    </div>
                )}
            </div>

            {/* Время (дополнительно) */}
            <div style={{ marginBottom: 16 }}>
                <Text strong>🕐 Время (дополнительно)</Text>
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <Tooltip title={isAlways ? 'Время недоступно для бессрочной ссылки' : 'Добавить 1 час к сроку'}>
                        <Button
                            type={timeType === '1hour' ? 'primary' : 'default'}
                            onClick={() => handleTimeClick('1hour')}
                            disabled={isAlways}
                        >
                            1 час
                        </Button>
                    </Tooltip>
                    <Tooltip title={isAlways ? 'Время недоступно для бессрочной ссылки' : 'Добавить 4 часа к сроку'}>
                        <Button
                            type={timeType === '4hours' ? 'primary' : 'default'}
                            onClick={() => handleTimeClick('4hours')}
                            disabled={isAlways}
                        >
                            4 часа
                        </Button>
                    </Tooltip>
                    <Tooltip title={isAlways ? 'Время недоступно для бессрочной ссылки' : 'Добавить 12 часов к сроку'}>
                        <Button
                            type={timeType === '12hours' ? 'primary' : 'default'}
                            onClick={() => handleTimeClick('12hours')}
                            disabled={isAlways}
                        >
                            12 часов
                        </Button>
                    </Tooltip>
                    <Tooltip title={isAlways ? 'Время недоступно для бессрочной ссылки' : 'Введите время вручную'}>
                        <Button
                            type={timeType === 'custom' ? 'primary' : 'default'}
                            onClick={() => handleTimeClick('custom')}
                            disabled={isAlways}
                        >
                            Вручную
                        </Button>
                    </Tooltip>
                </div>
                {timeType === 'custom' && !isAlways && (
                    <div style={{ marginTop: 8 }}>
                        <Space.Compact>
                            <Input
                                placeholder="чч:мм"
                                value={customTime}
                                onChange={(e) => setCustomTime(e.target.value)}
                                style={{ width: 150 }}
                            />
                            <Tooltip title={hasDateSelected ? 'Не более 24:00' : 'Любое время до 999:59'}>
                                <Button icon={<ClockCircleOutlined />} disabled />
                            </Tooltip>
                        </Space.Compact>
                        <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                            {hasDateSelected ? 'Максимум 24:00' : 'Максимум 999:59'}
                        </Text>
                    </div>
                )}
                {isAlways && (
                    <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                        Время не используется для бессрочной ссылки
                    </Text>
                )}
            </div>

            {/* Доступ */}
            <div style={{ marginBottom: 16 }}>
                <Text strong>⬇️ Доступ</Text>
                <div style={{ marginTop: 8 }}>
                    <Radio.Group
                        value={allowDownload}
                        onChange={(e) => setAllowDownload(e.target.value)}
                    >
                        <Radio value={false}>Только просмотр</Radio>
                        <Radio value={true}>Разрешить скачивание</Radio>
                    </Radio.Group>
                </div>
            </div>

            {/* Пароль */}
            <div>
                <Text strong>🔒 Пароль</Text>
                <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Checkbox
                            checked={passwordViewEnabled}
                            onChange={(e) => setPasswordViewEnabled(e.target.checked)}
                        >
                            Требовать пароль для просмотра
                        </Checkbox>
                        {passwordViewEnabled && (
                            <Input.Password
                                placeholder="Введите пароль"
                                value={passwordView}
                                onChange={(e) => setPasswordView(e.target.value)}
                                style={{ width: 200 }}
                                suffix={
                                    <Tooltip title="Скопировать пароль">
                                        <CopyOutlined
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => copyPassword(passwordView)}
                                        />
                                    </Tooltip>
                                }
                            />
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Checkbox
                            checked={passwordDownloadEnabled}
                            onChange={(e) => setPasswordDownloadEnabled(e.target.checked)}
                        >
                            Требовать пароль для скачивания
                        </Checkbox>
                        {passwordDownloadEnabled && (
                            <Input.Password
                                placeholder="Введите пароль"
                                value={passwordDownload}
                                onChange={(e) => setPasswordDownload(e.target.value)}
                                style={{ width: 200 }}
                                suffix={
                                    <Tooltip title="Скопировать пароль">
                                        <CopyOutlined
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => copyPassword(passwordDownload)}
                                        />
                                    </Tooltip>
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};