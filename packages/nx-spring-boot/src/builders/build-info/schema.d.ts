import { JsonObject } from '@angular-devkit/core';

export interface BuildInfoBuilderSchema extends JsonObject {
    root: string;
    ignoreWrapper?: boolean;
}