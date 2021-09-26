import { IS_WINDOWS } from "../constants";

export const MAVEN_EXECUTABLE = 'mvn';

export const GRADLE_EXECUTABLE = 'gradle';

export const MAVEN_WRAPPER_EXECUTABLE = IS_WINDOWS ? 'mvnw.cmd' : './mvnw';

export const GRADLE_WRAPPER_EXECUTABLE = IS_WINDOWS
  ? 'gradlew.bat'
  : './gradlew';
