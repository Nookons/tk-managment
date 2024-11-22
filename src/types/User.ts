
export interface IUser {
    id: string;
    first_name?: string;
    last_name?: string;
    email: string;
    password: string;
    last_modify?: string;
    experience?: number;
    position: string;
    start_work_time?: number;
    level?: number;
    profilePicture?: string;
}