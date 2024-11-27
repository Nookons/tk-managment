import React, { FC, useState, useEffect } from 'react';
import { Mentions, Spin } from 'antd';
import { IUser } from '../types/User';
import useFetchUser from '../hooks/useFetchUser';
import { MentionsOptionProps } from 'antd/es/mentions';

interface UserSelectProps {
    set_array: (data: IUser[]) => void;
}

const UserSelect: FC<UserSelectProps> = ({ set_array }) => {
    const { options, loading } = useFetchUser();
    const [local_state, setLocal_state] = useState<IUser[]>([]);

    useEffect(() => {
        set_array(local_state);
    }, [local_state, set_array]);

    if (loading) {
        return <Spin />;
    }

    const formattedOptions = options.map((el: IUser) => ({
        value: `${el.first_name}-${el.last_name}`,
        label: el.email,
    }));

    const onSelect = (option: MentionsOptionProps) => {
        const selectedUser = options.find((user) => user.id === option.value);
        if (selectedUser) {
            setLocal_state((prev) => [...prev, selectedUser]);
        }
    };

    return (
        <Mentions
            style={{ width: '100%' }}
            onSelect={onSelect}
            options={formattedOptions}
        />
    );
};

export default UserSelect;
