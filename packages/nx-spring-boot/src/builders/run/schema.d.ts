import { JsonObject } from '@angular-devkit/core';

export interface RunBuilderSchema extends JsonObject {
    root: string;
    args?: string[];
}