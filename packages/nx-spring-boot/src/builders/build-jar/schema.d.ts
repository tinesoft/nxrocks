import { JsonObject } from '@angular-devkit/core';

export interface BuildJarBuilderSchema extends JsonObject {
    root: string;
    args?: string[];
}