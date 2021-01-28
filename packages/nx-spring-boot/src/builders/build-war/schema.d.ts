import { JsonObject } from '@angular-devkit/core';

export interface BuildWarBuilderSchema extends JsonObject {
    root: string;
    ignoreWrapper?: boolean;
    args?: string[];
}