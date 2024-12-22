// src/components/Header/AddReport/Steps/TypeComponents/Robot.tsx
import React, { useEffect, useState } from 'react';
import robots_data from '../../../../utils/Robots.json';
import { Row, Col, Skeleton, Divider } from 'antd';
import RobotButtonsGroup from "./RobotButtonsGroup";
import RobotDescription from "./RobotDescription";
import RobotForm from "./RobotForm";
import { showNotificationSuccess } from './RobotNotifications';
import { setDataAndSubmit } from './RobotState';
import dayjs, { Dayjs } from 'dayjs';
import {useAppSelector} from "../../../../hooks/storeHooks";

const Robot = () => {
    const user = useAppSelector(state => state.user.user);
    const { options, loading, error } = useAppSelector(state => state.options);

    const [data, setData] = useState<any>({
        isDescription: false,
        isParts_to_change: false,
        change_parts: [],
        description: "",
        reason: "",
        unit_id: "",
        status: "founded"
    });

    const [pick_datetime, setPick_datetime] = useState<Dayjs>(dayjs());
    const [current_data, setCurrent_data] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (data.unit_id.length === 7) {
            const found = robots_data.find(robot => robot.id.toString() === data.unit_id);
            setCurrent_data(found || null);
        }
    }, [data]);

    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} xl={8}>
                <RobotForm
                    data={data}
                    robots_data={robots_data}
                    setData={setData}
                    pick_datetime={pick_datetime}
                    setPick_datetime={setPick_datetime}
                    isLoading={isLoading}
                    options={options}
                    onSubmit={() => setDataAndSubmit(data, pick_datetime, user, setData, setIsLoading, showNotificationSuccess)}
                />
            </Col>
            <Col xs={24} xl={16}>
                {data.unit_id.length === 7
                    ? <RobotButtonsGroup pick_datetime={pick_datetime} current_data={current_data} />
                    : <Skeleton />
                }
                <Divider dashed />
                {data.unit_id.length === 7
                    ? <RobotDescription current_data={current_data} />
                    : <Skeleton />
                }
            </Col>
        </Row>
    );
};

export default Robot;
