import { patchEnquirer } from './patch-enquirer';
import { patchNxJsDeps } from './patch-nx-js-deps';
import { patchNxProjectJs } from './patch-nx-project';

if (!process.env.SKIP_PATCHES) {
  patchNxJsDeps();
  patchNxProjectJs();
  patchEnquirer();
}
