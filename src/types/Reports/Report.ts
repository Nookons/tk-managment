export interface IReportChangePart {
    name: string;
}

export interface IReport {
    add_person: string;
    add_time: number;
    add_time_string: string;
    change_parts: IReportChangePart[];
    checkbox: boolean;
    description: string;
    id: number;
    reason: string;
    start_time: string;
    status: string;
    type: string;
    unit_id: string;
}
