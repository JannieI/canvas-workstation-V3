// ALL models (schema) are kept here
export class canvasActivity {
    id: number;
    createdBy: string;
    createdOn: string;
    activityType: string;
    activityStatus: string;
    linkedDashboardList: string[];
    activityText: string;
    activityComments: string[];
}

export class canvasMessage {
    id: number;
    sentBy: string;
    sentOn: string;
    toUsers: string[];      // Original list
    toGroups: string[];     // Original list
    recipient: string;      // Independant message, deduced from to lists
    read: boolean;
    subject: string;
    body: string;
    dashboardID: number;
}

export class canvasAlert {
    id: number;
    sentOn: string;
    recipient: string;
    read: boolean;
    alertText: string;
    alertData?: any;    //type of data, table name, field names, field values
}

export class widgetNote {
    id: number;
    dashboardID: number;
    widgetID: number;
    noteText: string;
    updatedBy: string;
    updatedOn: string;
}

export class widgetLinkedDashboard {
    id: number;
    sourceDashboardID: number;
    sourceWidgetID: number;
    destinationDashboardID: number;
    destinationWidgetID: number;
}

export class buttonBarAvailable {
    id: number;
    buttonText: string;
    description: string;
    sortOrder: number;
    isDefault: boolean;
}

export class buttonBarSelected {
    id: number;
    buttonText: string;
    description: string;
    sortOrder: number;
}

export class datasourceFilter {
    id: number;
    fieldName: string;
    operator: string;
    filterValue: string | number;
}

export class dataQualityIssue {
    id: number;
    status: string;
    name: string;
    type: string;
    description;
    nrIssues: number;
    loggedBy: string;
    loggedOn: string;
    solvedBy: string;
    solvedOn: string;
}

export class datasource {
    id: number;
    name: string;
    type: string;
    description;
}

export class currentDatasource {
    id: number;
    name: string;
    type: string;
    description: string;
    createdBy: string;
    createdOn: string;
    refreshedBy: string;
    refreshedOn;
    parameters: string;
}

// Dashboard
export class dashboard {
    id: number;
    state: string;
    name: string;
    description: string;
    nrWidgets: number;
    nrRecords: number;
    creator: string;
    nrTimesOpened: number;
}

export class dashboardTag {
    id: number;
    dashboardID: number;
    tag: string;
}

export class dashboardTemplate {
    id: number;
    name: string;
    description: string;
}

export class dashboardTheme {
    id: number;
    name: string;
    description: string;
}

export class dashboardComment {
    id: number;
    dashboardID: number;
    comment: string;
    creator: string;
    createdOn: string;
}

export class snapshot {
    id: number;
    dashboardID: number;
    name: string;
    comment: string;
}

export class dashboardSchedule {
    id: number;
    dashboardID: number;
    name: string;
    description: string;
    repeats: string;       // Daily, Weekday (M-F), Weekly, Monthly, Yearly
    repeatsEvery: number;  //   X                     X        X        X
    repeatsOn: string[];   // Weekly:  (M, T, W, ... S)
    repeatsFor: string;    // Monthly: DayOfWeek, DayOfMonth
    startsOn: string;      // Date
    EndsNever: boolean;
    EndsAfter: number;     // n times
    EndsOn: string;        // Date
}

// CSS Color
export class CSScolor {
    name: string;
}

export class transformation {
    id: number;
    category: string;
    name: string;
    description: string;
}

export class currentTransformation {
    id: number;
    category: string;
    name: string;
    description: string;
    fieldID: number;
    fieldName: string;
    parameters: string;
}

export class field {
    id: number;
    name: string;
    type: string;
    format: string;
    filter: string;
    calc: string;
    order: string;
}

export class fieldMetadata{
    name: string;
    type: string;
    description: string;
    keyField: boolean;
    explainedBy: string
}
