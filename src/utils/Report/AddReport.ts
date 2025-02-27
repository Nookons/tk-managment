import {IUser} from "../../types/User";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../firebase";
import dayjs from "dayjs";

export const AddReport = async (data: any, user: IUser) => {
   try {
       const report_id = dayjs().valueOf();

       const historyItem = {
           person: user.id,
           id: report_id,
           add_time_string: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
           add_time: dayjs().valueOf(),
           type: "Create report"
       }

       await setDoc(doc(db, "reports", report_id.toString()), {
           ...data,
           add_person: user.id,
           id: report_id,
           add_time: dayjs().valueOf(),
           add_time_string: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
       });

       await setDoc(doc(db, "reports_history", report_id.toString()), {
           actions_array: [historyItem]
       });

       return true
   } catch (err) {
       console.log(err);
       return false
   }
}