import React, {useEffect, useState} from 'react';
import {AutoComplete, QRCode} from "antd";
import options from "../../../../utils/WorkStation.json";
import {CloseSquareFilled} from "@ant-design/icons";
import CollectDataForm from "../Components/CollectDataForm";

const WorkStationForm = () => {
    const [unit_id, setUnit_id] = useState<string>("");
    const [picked_item, setPicked_item] = useState<any | null>(null);

    useEffect(() => {
        if (unit_id) {
            const founded = options.find(option => option.siteCode.toString() === unit_id);
            console.log(founded);
            if (founded) {
                setPicked_item(founded)
            }
        }
    }, [unit_id]);

    return (
        <div>
            <h4>Work Station Report page</h4>
            <AutoComplete
                options={options.map(option => ({label: option.siteCode.toString(), value: option.siteCode.toString()}))}
                style={{width: "100%"}}
                value={unit_id}
                onSearch={(event) => setUnit_id(event)}
                onChange={(event) => setUnit_id(event)}
                placeholder="Work Station search"
                allowClear={{ clearIcon: <CloseSquareFilled /> }}
                filterOption={(inputValue, option) =>
                    option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
            />
            {unit_id && <CollectDataForm unit_id={unit_id} type={"workStation"}/>}
        </div>
    );
};

export default WorkStationForm;