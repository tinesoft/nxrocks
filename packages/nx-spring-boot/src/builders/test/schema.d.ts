import { JsonObject } from '@angular-devkit/core';

export interface TestBuilderSchema extends JsonObject {
    root: string;
    args?: string[];
}