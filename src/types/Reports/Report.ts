export interface IReportChangePart {
    name: string;
}

export interface IReportTimelineItem {
    add_time: number;           // The timestamp as a number
    add_time_string: string;    // The timestamp as a string
    id: number;                 // Unique identifier (number)
    person: string;             // Person ID (string)
    type: string;
    change?: string | IReportChangePart[];
}


export interface IReport {
    add_person: string;
    closedBy?: string;
    closedAt?: string;
    closedAtString?: string;
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
    last_modify_time?: string;
    last_modify_person?: string;
}
