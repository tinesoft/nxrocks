import { IS_WINDOWS } from "@nxrocks/common";

export const MAVEN_EXECUTABLE = 'mvn';

export const GRADLE_EXECUTABLE = 'gradle';

export const MAVEN_WRAPPER_EXECUTABLE = IS_WINDOWS ? 'mvnw.cmd' : './mvnw';

// previous versions of the wrapper were using '.bat' extension for Windows executable
export const MAVEN_WRAPPER_EXECUTABLE_LEGACY = IS_WINDOWS ? 'mvnw.bat' : './mvnw';

export const GRADLE_WRAPPER_EXECUTABLE = IS_WINDOWS
  ? 'gradlew.bat'
  : './gradlew';
