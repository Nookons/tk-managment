import React, {useEffect, useState} from 'react';
import {Button, Card, Descriptions, Divider, Form, Image, message, Row, Select, Skeleton} from "antd";
import Col from "antd/es/grid/col";
import {IOption} from "../../types/Option";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import dayjs from "dayjs";
import {useAppSelector} from "../../hooks/storeHooks";
import Text from "antd/es/typography/Text";
import Checkbox from "antd/es/checkbox/Checkbox";
import TextArea from "antd/es/input/TextArea";

const SoloPart = ({option}: { option: IOption }) => {
    const user = useAppSelector(state => state.user.user)
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isDescription, setIsDescription] = useState<boolean>(false);

    const [data, setData] = useState({
        part_type: "",
        description: "",
    });

    useEffect(() => {
        if (option) {
            setData({
                part_type: option.part_type || "unknown",
                description: option.description || "Sorry but on this moment we don't have description for item 😓",
            });
        }
    }, [option]);

    const onUpdateItem = async () => {
        try {
            setIsLoading(true)
            const ref = doc(db, "item_library", option.code);
            await updateDoc(ref, {
                ...data,
                person_update: user,
                update_time: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
                timestamp: dayjs().valueOf(),
            });
        } catch (err) {
            err && message.error(err.toString())
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <Col xs={24} xl={8} key={`${option.id}-${option.code}`}>
            <Card title={option.name} extra={<Button type={"link"} onClick={onUpdateItem}>Save</Button>}>
                {isLoading
                    ? <Skeleton />
                    :
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Checkbox style={{margin: "8px 0", width: "100%"}} value={isDescription} onChange={() => setIsDescription(!isDescription)}>Change
                                description</Checkbox>
                            {isDescription
                                ? <TextArea onChange={(event) => setData((prev) => ({...prev, description: event.target.value}))} placeholder={data.description} rows={2}/>
                                : <Text type="secondary">{data.description}</Text>
                            }
                        </Col>
                        <Col span={24}>
                            <Descriptions size={"small"} bordered>
                                <Descriptions.Item span={3} label="Code">{option.code}</Descriptions.Item>
                                {option.update_time &&
                                    <Descriptions.Item span={3} label="Updated">{option.update_time}</Descriptions.Item>}
                                {option.person_update && <Descriptions.Item span={3}
                                                                            label="Person">{option.person_update?.email}</Descriptions.Item>}
                                <Descriptions.Item span={3} label="For">
                                    <Select
                                        disabled={isLoading}
                                        loading={isLoading}
                                        onSelect={(e) => setData((prev) => ({...prev, part_type: e}))}
                                        value={data.part_type}
                                        style={{width: "100%"}}
                                    >
                                        <Select.Option value="workstation">WorkStation</Select.Option>
                                        <Select.Option value="robot">Robot</Select.Option>
                                        <Select.Option value="charge">Charge Station</Select.Option>
                                        <Select.Option value="vse">VSW</Select.Option>
                                        <Select.Option value="qr">QR Code</Select.Option>
                                        <Select.Option value="unknown" disabled>
                                            Unknown
                                        </Select.Option>
                                    </Select>
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                }
            </Card>
        </Col>
    );
};

export default SoloPart;
