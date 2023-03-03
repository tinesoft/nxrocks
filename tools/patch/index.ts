import { patchEnquirer } from "./patch-enquirer";
import { patchNxJsDeps } from "./patch-nx-js-deps";
import { patchSemanticReleaseMonorepo } from "./patch-semantic-release-monorepo"


patchSemanticReleaseMonorepo();
patchNxJsDeps();
patchEnquirer();
