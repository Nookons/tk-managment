interface OperationPoint {
    id: number;                        // Unique identifier for the operation point
    operationPointCode: string;       // Code representing the operation point
    operationPointName: string;       // Name of the operation point
    siteCode: string;                 // Site code
    loadType: number;                 // Type of load
    loadConfig: string;               // Configuration of load
    currentLoadConfig: string | null; // Current load configuration (nullable)
    loadCode: string;                 // Code for the load
    locationX: number;                // X-coordinate location
    locationY: number;                // Y-coordinate location
    cellCode: string;                 // Code of the cell
    occupancyState: number;           // State of occupancy
    operationOrder: number;           // Order of operation
    placeDir: string | null;          // Placement direction (nullable)
    nodeCode: string;                 // Node code
    cacheNodeCode: string;            // Cache node code
    parkId: number;                   // Park ID
    stopPointType: number;            // Type of stop point
    unloadMode: string | null;        // Unload mode (nullable)
    reservation1: string;             // Reservation field 1
    reservation2: string;             // Reservation field 2
    reservation3: string;             // Reservation field 3
    reservation4: string;             // Reservation field 4
    reservation5: string;             // Reservation field 5
    reservation6: string;             // Reservation field 6
    status: number;                   // Status of the operation point
    creator: string;                  // Creator of the operation point
    creationTime: number;             // Creation time (timestamp)
    modifier: string;                 // Last modifier
    modifyTime: number;               // Modification time (timestamp)
    taskLimit: number;                // Task limit
    handlingWay: string | null;       // Handling method (nullable)
    seedingWallType: string | null;   // Type of seeding wall (nullable)
    designatedSeedingRule: any[];     // Array of designated seeding rules
    maxQueueRobotNum: number;         // Maximum number of robots in the queue
    picklatticeRowindex: number;      // Row index for pick lattice
    picklatticeCollindex: number;     // Column index for pick lattice
    putlatticeRowindex: number | null; // Row index for put lattice (nullable)
    putlatticeCollindex: number | null; // Column index for put lattice (nullable)
    hasBCR: boolean | null;           // Indicates if BCR is available (nullable)
    hasWeight: boolean | null;        // Indicates if weight is available (nullable)
    weightEnable: number;             // Weight enable flag
    containerOverWeightLimit: number; // Container over weight limit
    containerOverWeightMode: string;  // Over weight mode
    parkType: string | null;          // Type of park (nullable)
    gripperCode: string;              // Code of the gripper
    bcrenable: number;                // BCR enable flag
}

// Define an interface for the data item
export interface IDataItem {
    siteCode: string;                 // Code for the site
    taskType: string;                 // Type of task (e.g., "putaway")
    currentFunctionType: string;      // Current function type as a string
    left: OperationPoint | null;      // Left operation point (nullable)
    right: OperationPoint | null;     // Right operation point (nullable)
    toolSeedingWalls: any | null;     // Tool seeding walls (can hold any type or null)
}
export interface IApiResponse {
    code: number;                 // Numeric code
    data: IDataItem[];            // Array of data items
    msg: string;                 // JSON-encoded message string
    succ: boolean;               // Success flag
}