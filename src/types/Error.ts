
export interface IError {
    text: string;
    id: string;
    endTime: string;
    startTime: string;
    workStation: string;
    vsw?: string;
    isVsw?: boolean;
}