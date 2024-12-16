import { IItem } from "../../types/Item";
import {arrayUnion, doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import { db } from "../../firebase";
import { ITote } from "../../types/Tote";
import dayjs from "dayjs";
import {IUser} from "../../types/User";

export const UseOneFromTote = async (item: IItem, toteId: string | null, user: IUser) => {
    if (!toteId) {
        return null;
    }

    const formattedDate = dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss");
    const timestamp = dayjs().valueOf();
    const docRef = doc(db, "tote_info", toteId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const tote: ITote = docSnap.data() as ITote;
        const itemIndex = tote.item_inside.findIndex(el => el.code === item.code);

        if (itemIndex !== -1) {
            tote.item_inside.splice(itemIndex, 1);

            await updateDoc(docRef, {
                item_inside: tote.item_inside,
                update_time: formattedDate,
                timestamp: timestamp,
            });

            await setDoc(doc(db, "tote_history", toteId), {
                actions: arrayUnion({
                    color: "red",
                    tote_number: toteId,
                    type: "Remove",
                    item: item,
                    action_time: formattedDate,
                    updated_by: user,
                    id: timestamp,
                }),
                updated_at: formattedDate,
                updated_by: user,
                tote_id: toteId,
            }, { merge: true });

            console.log(`Removed item: ${item.name}`);
        } else {
            console.log("Item not found in the tote.");
        }
    } else {
        console.log("No such document!");
    }
};

