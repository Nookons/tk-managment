import { setDoc, doc } from 'firebase/firestore';
import dayjs from 'dayjs';
import {message} from "antd";
import {db} from "../../../../firebase";

export const setDataAndSubmit = async (data: any, pick_datetime: any, user: any, setData: any, setIsLoading: any, showNotificationSuccess: any) => {
    try {
        if (data.unit_id.length !== 7) {
            message.error("Invalid robot id");
            return;
        }

        setIsLoading(true);
        const id = dayjs().valueOf().toString();
        const prepared_data = {
            ...data,
            task_id: id,
            type: "robot",
            added_person: user,
            start_time: dayjs(pick_datetime).format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
            lastUpdate: dayjs(pick_datetime).format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
            lastUpdateBy: user.email,
            start_timestamp: dayjs(pick_datetime).valueOf(),
        };

        await setDoc(doc(db, "task_list", id), prepared_data);
        showNotificationSuccess(id);

        setData({
            isDescription: false,
            isParts_to_change: false,
            description: "",
            change_parts: [],
            reason: "",
            unit_id: "",
            status: "founded"
        });

    } catch (err) {
        err && message.error(err.toString());
    } finally {
        setIsLoading(false);
    }
};
