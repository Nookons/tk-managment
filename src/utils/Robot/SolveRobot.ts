import {deleteDoc, doc} from "firebase/firestore";
import {db} from "../../firebase";

export const removeRobotReport = async (id: string) => {
    await deleteDoc(doc(db, "robots_break", id));


}