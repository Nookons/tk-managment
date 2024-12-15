import { IItem } from "../../types/Item";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { ITote } from "../../types/Tote";
import dayjs from "dayjs";

export const UseOneFromTote = async (item: IItem, toteId: string | null) => {
    if (!toteId) {
        return null;
    }

    const docRef = doc(db, "tote_info", toteId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const tote: ITote = docSnap.data() as ITote;
        const itemIndex = tote.item_inside.findIndex(el => el.code === item.code);

        if (itemIndex !== -1) {
            tote.item_inside.splice(itemIndex, 1);

            await updateDoc(docRef, {
                item_inside: tote.item_inside,
                update_time: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
                timestamp: dayjs().valueOf(),
            });

            console.log(`Removed item: ${item.name}`);
        } else {
            console.log("Item not found in the tote.");
        }
    } else {
        console.log("No such document!");
    }
};

