// ALL models (schema) are kept here

// Datasource
export class datasource {
    id: number;
    name: string;
    type: string;
    description;
}

// Dashboard
export class dashboard {
    name: string;
    description: string;
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

export class field {
    id: number;
    name: string;
    type: string;
    format: string;
    filter: string;
    calc: string;
    order: string;
}

export class fieldsMetadata{
    name: string;
    type: string;
    description: string;
    keyField: boolean;
    explainedBy: string
}
