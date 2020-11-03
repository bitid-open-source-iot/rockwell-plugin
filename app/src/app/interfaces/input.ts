export interface Input {
    "in"?: {
        "key"?: string;
        "moduleId"?: number;
        "deviceId"?: string;
    };
    "out"?: {
        "key"?: string;
        "moduleId"?: number;
    };
    "value"?: number;
    "tagId"?: string;
    "inputId"?: string;
    "writeable"?: boolean;
    "allowance"?: number;
    "interface"?: string;
    "description"?: string;
}