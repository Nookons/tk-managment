import React, {FC} from 'react';
import {Select, Spin} from "antd";
import useFetchOptions from "../../../../hooks/useFetchOptions";
import {IOption} from "../../../../types/Item";

interface SelectItemsProps {
    setChange_data: (item: IOption[]) => void; // Ожидаем IItem[]
}

const SelectItems: FC<SelectItemsProps> = ({setChange_data}) => {
    const {options, loading} = useFetchOptions();

    const handleChange = (value: string[]) => {
        const result: IOption[] = [];

        value.forEach(el => {
            const found = options.find(item => item.name === el)
            result.push(found as IOption)
        })

        setChange_data(result);
    };

    if (loading) {
        return <Spin/>;
    }

    const formattedOptions = options.map((el: IOption) => ({
        value: el.name,
        label: el.name,
    }));

    return (
        <Select
            mode="multiple"
            style={{width: '100%'}}
            placeholder="Select one country"
            onChange={handleChange}
            options={formattedOptions} // Теперь options содержит emoji и desc
        />
    );
};

export default SelectItems;
