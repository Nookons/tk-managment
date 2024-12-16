// In src/utils/Item/AddItem.ts
import { arrayUnion, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";
import { IItem } from "../../types/Item";
import {IUser} from "../../types/User";

export const addItem = async ({ item, user }: { item: IItem, user: IUser }) => {
    try {
        const timestamp = Date.now();
        const formattedDate = dayjs(timestamp).format("dddd, MMMM DD, YYYY [at] HH:mm:ss");
        const boxId = item.box_number.length >= 7 ? item.box_number.slice(0, 7) : item.box_number;

        await setDoc(doc(db, "warehouse", timestamp.toString()), {
            ...item,
            created_at: serverTimestamp(),
        });

        await setDoc(doc(db, "tote_info", boxId), {
            item_inside: arrayUnion(item),
            timestamp,
            tote_number: boxId,
            update_time: formattedDate,
            updated_by: item.user,
            id: timestamp,
        }, { merge: true });

        await setDoc(doc(db, "tote_history", boxId), {
            actions: arrayUnion({
                color: "green",
                tote_number: boxId,
                type: "Add",
                item: item,
                action_time: formattedDate,
                updated_by: user,
                id: timestamp,
            }),
            updated_at: formattedDate,
            updated_by: user,
            tote_id: boxId,
        }, { merge: true });

    } catch (error) {
        console.error("Error adding item: ", error);
    }
};
