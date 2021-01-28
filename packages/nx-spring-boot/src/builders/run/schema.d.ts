import { JsonObject } from '@angular-devkit/core';

export interface RunBuilderSchema extends JsonObject {
    root: string;
    ignoreWrapper?: boolean;
    args?: string[];
}