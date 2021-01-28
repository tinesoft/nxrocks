import { JsonObject } from '@angular-devkit/core';

export interface BuildJarBuilderSchema extends JsonObject {
    root: string;
    ignoreWrapper?: boolean;
    args?: string[];
}