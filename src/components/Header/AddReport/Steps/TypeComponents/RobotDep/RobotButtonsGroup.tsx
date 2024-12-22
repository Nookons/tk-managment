import React, {FC} from 'react';
import {Button, message, Tooltip} from "antd";
import dayjs, {Dayjs} from "dayjs";
import Text from "antd/es/typography/Text";

interface RobotButtonsGroupProps {
    pick_datetime: Dayjs;
    current_data: any;
}

const RobotButtonsGroup:FC <RobotButtonsGroupProps> = ({pick_datetime, current_data}) => {

    const onOpen = async (type: string) => {
        const date = pick_datetime.add(7, 'hour').format("YYYY-MM-DD"); // Добавляем 7 часов к дате

        switch (type) {
            case "img":
                window.open(`http://${current_data?.ip}:5000/camerapics/${dayjs(pick_datetime).format("YYYY-MM-DD")}/`, '_blank');
                break;
            case "full":
                window.open(`http://10.46.143.3/log/tomcat-rms/athena/robot/${date}/`, '_blank');
                break;
            default:
                message.error("Unknown type");
        }
    };

    const LogObj = () => {
        return (
            <div>
                <article>Chines Date: {pick_datetime.add(7, "hour").format("YYYY-MM-DD")}</article>
                <article>Chines Time: {pick_datetime.add(7, "hour").format("HH:mm")}</article>
            </div>
        );
    };

    return (
        <>
            <Text type="secondary">
                <article>Download data will be able to attach after task create</article>
            </Text>
            <Button.Group>
                <Button onClick={() => onOpen("full")} style={{width: "100%"}}>
                    <Tooltip title={<LogObj/>}>
                        <span>Full logs</span>
                    </Tooltip>
                </Button>
                <Button onClick={() => onOpen("img")}>Images</Button>
                <Button
                    onClick={() => window.open(`http://${current_data?.ip}:9001/logtail/OBSTACLE_DETECTOR`, '_blank')}>
                    Radar logs
                </Button>
                <Button>Check Full History</Button>
            </Button.Group>
        </>
    );
};

export default RobotButtonsGroup;