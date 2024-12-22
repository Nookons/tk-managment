// src/components/Header/AddReport/Steps/TypeComponents/RobotNotifications.tsx
import { notification } from 'antd';

export const showNotificationSuccess = (task_id: string) => {
    notification.success({
        message: <span>Task for that robot was added</span>,
        description: <span>Hi there, robot was successfully added, task id: {task_id}</span>,
        placement: 'topRight',
    });
};
