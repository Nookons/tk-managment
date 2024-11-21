import React, {FC, useEffect, useState} from 'react';
import {Card, Descriptions, List, Row, Spin, Table} from "antd";
import {IDataItem} from "../../../types/WorkStation";
import Col from "antd/es/grid/col";
import Meta from "antd/es/card/Meta";
import dayjs from "dayjs";
import Text from "antd/es/typography/Text";

interface SoloStationProps {
    workstation_data: IDataItem;
}

const SoloStation: FC<SoloStationProps> = ({workstation_data}) => {

    if (!workstation_data) {
        return <Spin/>;
    }


    return (
        <Card title={`🎰 ${workstation_data.siteCode}`}>
            <Meta title={`${workstation_data.taskType.toUpperCase()}`}
                  description={`Current Function Type: ${workstation_data.currentFunctionType}`}/>
            <Row style={{marginTop: 14}} gutter={[16, 16]}>
                <Col span={12}>
                    <Descriptions size={"small"} title="Left Section" bordered column={1}>
                        {workstation_data.left && (
                            <>
                                {workstation_data.left.creationTime && (
                                    <Descriptions.Item span={3} label={"Creation Time"}>
                                        {dayjs(workstation_data.left.creationTime).format("YYYY-MM-DD [at] HH:mm:ss")}
                                    </Descriptions.Item>
                                )}
                                {workstation_data.left.modifyTime && (
                                    <Descriptions.Item span={3} label={"Last Modify Time"}>
                                        {dayjs(workstation_data.left.modifyTime).format("[at] HH:mm:ss")}
                                    </Descriptions.Item>
                                )}
                                {workstation_data.left.nodeCode && (
                                    <Descriptions.Item span={3} label={"Node Code"}>
                                        {workstation_data.left.nodeCode}
                                    </Descriptions.Item>
                                )}
                                {workstation_data.left.status && (
                                    <Descriptions.Item span={3} label={"Status"}>
                                        {workstation_data.left.status}
                                    </Descriptions.Item>
                                )}
                            </>
                        )}
                    </Descriptions>
                </Col>
                <Col span={12}>
                    <Descriptions size={"small"} title="Right Section" bordered column={1}>
                        {workstation_data.right && (
                            <>
                                {workstation_data.right.creationTime && (
                                    <Descriptions.Item span={3} label={"Creation Time"}>
                                        {dayjs(workstation_data.right.creationTime).format("YYYY-MM-DD [at] HH:mm:ss")}
                                    </Descriptions.Item>
                                )}
                                {workstation_data.right.modifyTime && (
                                    <Descriptions.Item span={3} label={"Last Modify Time"}>
                                        {dayjs(workstation_data.right.modifyTime).format("[at] HH:mm:ss")}
                                    </Descriptions.Item>
                                )}
                                {workstation_data.right.nodeCode && (
                                    <Descriptions.Item span={3} label={"Node Code"}>
                                        {workstation_data.right.nodeCode}
                                    </Descriptions.Item>
                                )}
                                {workstation_data.right.status && (
                                    <Descriptions.Item span={3} label={"Status"}>
                                        {workstation_data.right.status}
                                    </Descriptions.Item>
                                )}
                            </>
                        )}
                    </Descriptions>
                </Col>
            </Row>
        </Card>
    );
};

export default SoloStation;
