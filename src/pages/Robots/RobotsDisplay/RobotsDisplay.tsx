import React from 'react';
import {useAppSelector} from "../../../hooks/storeHooks";
import {IBrokenRobots} from "../../../types/Robot";
import {Avatar, Descriptions, Image, Tree} from "antd";
import robot_logo from "../../../assets/robot.webp"

const RobotsDisplay = () => {
    const {broken_robots} = useAppSelector(state => state.broken_robots)


    return (
        <div>
            {broken_robots.map((robot: IBrokenRobots) => {

                return (
                    <div>
                        <Image
                            width={200}
                            src={robot_logo}
                        />
                        <Descriptions  layout={"horizontal"} title="">
                            <Descriptions.Item span={3} label="Robot number">{robot.error_array[0].robot_number}</Descriptions.Item>
                            <Descriptions.Item label="Robot errors">

                                <Tree
                                    checkable
                                    defaultExpandedKeys={["0-0-0", "0-0-1"]}
                                    defaultSelectedKeys={["0-0-0", "0-0-1"]}
                                    defaultCheckedKeys={["0-0-0", "0-0-1"]}
                                    treeData={[
                                        {
                                            title: "parent 1",
                                            key: "0-0",
                                            children: [
                                                {
                                                    title: "parent 1-0",
                                                    key: "0-0-0",
                                                    disabled: true,
                                                    children: [
                                                        {
                                                            title: "leaf",
                                                            key: "0-0-0-0",
                                                            disableCheckbox: true,
                                                        },
                                                        {
                                                            title: "leaf",
                                                            key: "0-0-0-1",
                                                        },
                                                    ],
                                                },
                                                {
                                                    title: "parent 1-1",
                                                    key: "0-0-1",
                                                    children: [
                                                        {
                                                            title: <span style={{color: "#1890ff"}}>sss</span>,
                                                            key: "0-0-1-0",
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ]}
                                />
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                )
            })}
        </div>
    );
};

export default RobotsDisplay;