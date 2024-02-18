import { createNodesFor } from "@nxrocks/common";
import { NX_FLUTTER_PKG } from "../index";
import { isFlutterProject } from "../utils/flutter-utils";

// wrapped into a () to avoid the 'Cannot access 'NX_FLUTTER_PKG' before initialization'
export const createNodesFn = () => createNodesFor(['pubspec.yaml'], isFlutterProject, NX_FLUTTER_PKG); 