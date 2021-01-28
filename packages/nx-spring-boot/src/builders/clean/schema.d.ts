import { JsonObject } from '@angular-devkit/core';

export interface CleanBuilderSchema extends JsonObject {
    root: string;
    ignoreWrapper?: boolean;
    args?: string[];
}