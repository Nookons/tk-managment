import { IReport } from "../../types/Reports/Report";
import { IUser } from "../../types/User";
import {arrayUnion, doc, setDoc, updateDoc} from "firebase/firestore"; // Ensure correct import
import { db } from "../../firebase";
import dayjs from "dayjs";

interface CloseReportProps {
    reportData: IReport;
    user: IUser;
}

export const closeReport = async ({ reportData, user }: CloseReportProps): Promise<boolean> => {
    try {
        if (!reportData || !user) return false;

        const id = dayjs().valueOf().toString();
        const reportRef = doc(db, "reports", reportData.id.toString()); // Ensure reportData.id is valid

        const historyItem = {
            person: user.id,
            id: id,
            report_id: reportData.id.toString(),
            add_time_string: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
            add_time: dayjs().valueOf(),
            type: "Close Report"
        }

        await updateDoc(reportRef, {
            status: "Closed",
            closedBy: user.id.toString(),
            closedAt: dayjs().valueOf(),
            closedAtString: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss")
        });

        await setDoc(doc(db, "reports_history", id), {
            ...historyItem
        });

        return true;
    } catch (error) {
        console.error("Error closing report:", error);
        return false;
    }
};
