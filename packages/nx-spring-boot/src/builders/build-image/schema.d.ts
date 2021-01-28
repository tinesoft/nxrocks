import { JsonObject } from '@angular-devkit/core';

export interface BuildImageBuilderSchema extends JsonObject {
    root: string;
    ignoreWrapper?: boolean;
    args?: string[];
}