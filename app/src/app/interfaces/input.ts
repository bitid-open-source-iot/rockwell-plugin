import { Register } from './register';

export interface Input extends Register {
    'analog'?: {
        'scaling'?: {
            'raw'?: {
                'low'?: number;
                'high'?: number;
            };
            'scaled'?: {
                'low'?: number;
                'high'?: number;
            };
            'type'?: string;
        };
        'key'?: string;
        'units'?: string;
        'offset'?: number;
        'decimals'?: number;
    };
    'digital'?: {
        'bit'?: number;
        'low'?: number;
        'high'?: number;
    };
    'type'?: string;
    'tagId'?: string;
    'value'?: any;
    'hidden'?: boolean;
    'inputId'?: string;
    'deviceId'?: string;
    'priority'?: boolean;
    'moduleId'?: number;
    'description'?: string;
}