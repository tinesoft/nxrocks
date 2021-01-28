import { JsonObject } from '@angular-devkit/core';

export interface CleanBuilderSchema extends JsonObject {
    root: string;
    args?: string[];
}