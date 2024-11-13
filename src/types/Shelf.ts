export interface IShelf {
    demandId: string;
    taskId: number;
    siteCode: string;
    stopPointCode: string;
    stopPointGroupKey: string | null;
    bizCodes: string | null;
    hodCode: string;
    pairHodCodes: string | null;
    swapHodCode: string | null;
    estimateOperationSeconds: number | null;
    priority: number;
    businessSequence: number;
    boxOrder: string | null;
    robotLayer: string | null;
    isRiseBoard: boolean;
    latticeCode: string | null;
    hodSides: Array<string | null>;
    destAreaId: string | null;
    demandTime: number;
    sentTime: number;
    returnTime: number | null;
    arrivedTime: number | null;
    sendReturnCode: number;
    arrivedHodSide: string | null;
    submitTime: number | null;
    isInQueue: boolean | null;
    hodUseType: string | null;
    demandType: string;
    dispatchType: string;
    taskItems: ITaskItem[];
    taskRecords: ITaskRecord[];
    isComing: boolean;
    pickingFetchedBox: string | null;
    pickingReturnedBox: string | null;
    putAwayArrivedTime: number | null;
    putAwayOnSite: boolean | null;
    putAwayCancel: boolean | null;
    putAwayAvailableCount: number | null;
    putAwayTotalAvailableCount: number;
    putAwayForceBack: boolean;
    putAwayFetchedBox: string | null;
    putAwayReturnedBox: string | null;
    putAwayLastFetchedTime: number | null;
    isArrived: boolean;
    taskCanceled: boolean;
    haveSendBack: boolean;
    bizPrimaryUuid: string | null;
    needReSendNewTask: boolean;
    parkIds: number[];
    demand: IDemand;
}

interface ITaskItem {
    demandId: string;
    demandTime: number;
    arriveTime: number | null;
    needSide: string | null;
    hodScore: number | null;
    estimateOperationTime: number | null;
    bizCode: string;
    bizDetailCode: string;
    hodCode: string;
    stopPointCode: string;
    isConsumed: boolean;
    isDeliverBack: boolean;
    bizType: string | null;
    batchCode: string | null;
    isLastDemand: boolean;
    demandType: string;
    batchProcessMode: boolean;
    dispatchCallBackPhase: string;
    dispatchCallBackConsumer: Record<string, unknown>;
}

interface ITaskRecord {
    sendRequestId: string;
    taskId: number;
    sendTime: number;
    returnCode: number;
    arrivedTime: number | null;
    arrivedShelfSide: string | null;
    submitToBizTime: number | null;
    submitToBizTimes: number | null;
    arrivedRequestIds: string[];
}

interface IDemand {
    id: string;
    priority: number;
    businessSequence: number | null;
    estimateOperationSeconds: number | null;
    destAreaId: string | null;
    destCellCode: string | null;
    destRobotFork: string | null;
    bizCodes: string | null;
    bizIsFinish: boolean;
    batchCode: string | null;
    isLastDemand: boolean;
    isBatchDispatch: boolean;
    taskId: number;
    isContinue: boolean | null;
    boxOrder: string | null;
    robotLayer: string | null;
    isRiseBoard: boolean;
    latticeCode: string | null;
    hasBox: boolean;
    needCallBack: boolean;
    directBack: boolean;
    isComing: boolean;
    swapHodCode: string | null;
    siteCode: string;
    stopPointGroupKey: string | null;
    stopPointCode: string;
    hodCode: string;
    hodCodes: string | null;
    pairHodCodes: string | null;
    hodSide: string | null;
    hodEnterInSide: string | null;
    needSides: string | null;
    isSendRobotTask: boolean;
    isStopTask: boolean;
    taskType: string | null;
    dispatchType: string;
    hodUseType: string | null;
    externalSourceStationType: string | null;
    demandType: string;
    bizDesignatedDemand: boolean;
    reqStopPointCodes: string | null;
    sameDemandDefine: string;
    isForceBack: boolean;
    shelfScore: number | null;
    bizType: string | null;
    parkIds: number[];
    actualBoxCode: string | null;
    latticeCodeList: string | null;
    rackShelfInfos: string | null;
    transferBoxInfos: string | null;
    allowChangeShelfPlacement: boolean | null;
    cancelManualExc: boolean | null;
    checkConsumed: boolean;
    relatedTaskIds: string | null;
    unionStationId: string | null;
    isUnionStation: boolean | null;
    rectifiedHodSide: string | null;
    batchProcessMode: boolean | null;
    designateDestinationMap: Record<string, unknown> | null;
    notCancelItemTask: boolean;
    isReSendNewTask: boolean;
    removeBox: boolean;
    emptyBox: boolean;
    addBox: boolean;
}