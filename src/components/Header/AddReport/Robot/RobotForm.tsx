import React, {useState} from 'react';
import {AutoComplete} from "antd";
import options from '../../../../utils/Robots.json'
import {CloseSquareFilled} from "@ant-design/icons";
import CollectDataForm from "../Components/CollectDataForm";

const RobotForm = () => {
    const [unit_id, setUnit_id] = useState<string>("");

    return (
        <div>
            <AutoComplete
                options={options.map(option => ({label: option.id.toString(), value: option.id.toString()}))}
                style={{width: "100%"}}
                value={unit_id}
                onSearch={(event) => setUnit_id(event)}
                onChange={(event) => setUnit_id(event)}
                placeholder="Robots search"
                allowClear={{ clearIcon: <CloseSquareFilled /> }}
                filterOption={(inputValue, option) =>
                    option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
            />
            <CollectDataForm unit_id={unit_id} />
        </div>
    );
};

export default RobotForm;