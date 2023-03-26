import { patchEnquirer } from "./patch-enquirer";
import { patchNxJsDeps } from "./patch-nx-js-deps";

if(!process.env.SKIP_PATCHES){
    patchNxJsDeps();
    patchEnquirer();
}
