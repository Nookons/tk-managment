import React from 'react';
import robots_data from '../../../../../utils/Robots.json'
import {AutoComplete, Form} from "antd";

const Robot = () => {

    return (
        <div>
            <Form.Item label="Robot ID" name="robot_id">
                <AutoComplete
                    style={{ width: 200 }}
                    options={robots_data.map(robot => ({value: robot.id.toString(), label: robot.id.toString()}))}
                    placeholder="1332248"
                    filterOption={(inputValue, option) =>
                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                />
            </Form.Item>
        </div>
    );
};

export default Robot;