import React, {FC, useState} from 'react';
import {Select, Spin, Tag} from "antd";
import useFetchOptions from "../../../../hooks/useFetchOptions";
import {IOption} from "../../../../types/Item";
import {CheckCircleOutlined, YoutubeOutlined} from "@ant-design/icons";

interface SelectItemsProps {
    setChange_data: (item: IOption[]) => void; // Ожидаем IItem[]
}

const SelectItems: FC<SelectItemsProps> = ({setChange_data}) => {
    const {options, loading} = useFetchOptions();

    const [localData, setLocalData] = useState<IOption[]>([]);

    const handleChange = (value: string[]) => {
        const result: IOption[] = [];

        value.forEach(el => {
            const found = options.find(item => item.name === el)
            result.push(found as IOption)
        })

        setChange_data(result);
        setLocalData(result);
    };

    if (loading) {
        return <Spin/>;
    }

    const formattedOptions = options.map((el: IOption) => ({
        value: el.name,
        label: el.name,
    }));

    return (
        <>
            <Select
                mode="multiple"
                style={{width: '100%'}}
                placeholder="Select items to change"
                onChange={handleChange}
                options={formattedOptions} // Теперь options содержит emoji и desc
            />
            <div style={{marginTop: 14}}>
                {localData.map(el => {
                    return (
                        <Tag style={{marginTop: 8}} icon={<CheckCircleOutlined />} color="#1b7bad">
                            <span>{el.name} | {el.code}</span>
                        </Tag>
                    )
                })}
            </div>
        </>
    );
};

export default SelectItems;
