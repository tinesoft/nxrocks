import {getGradleDependencyIdRegEx} from "./utils";

describe('utils', () => {

  describe('getGradleDependencyIdRegEx', () => {

    const singleQuote = `\timplementation 'com.site:package'`;
    const doubleQuote = `\timplementation "com.site:package"`;
    const singleQuoteParen = `\timplementation('org.springframework.boot:spring-boot-starter')`;
    const singleDoubleQuoteParen = `\timplementation("org.springframework.boot:spring-boot-starter")`;
    const testPrefix = `\ttestImplementation 'org.springframework.boot:spring-boot-starter-test'`;
    const spacePrefix = `    implementation 'com.site:package'`;
    const allFormats = `
dependencies {
${singleQuote}
${doubleQuote}
${singleQuoteParen}
${singleDoubleQuoteParen}
${testPrefix}
}
`;

    it('should match single quote', () => {
      const isMatch = getGradleDependencyIdRegEx().test(singleQuote);
      expect(isMatch).toEqual(true);
    });

    it('should match double quote', () => {
      const isMatch = getGradleDependencyIdRegEx().test(doubleQuote);
      expect(isMatch).toEqual(true);
    });

    it('should match single quote parentheses', () => {
      const isMatch = getGradleDependencyIdRegEx().test(singleQuoteParen);
      expect(isMatch).toEqual(true);
    });

    it('should match double quote parentheses', () => {
      const isMatch = getGradleDependencyIdRegEx().test(singleDoubleQuoteParen);
      expect(isMatch).toEqual(true);
    });

    it('should match test prefix', () => {
      const isMatch = getGradleDependencyIdRegEx().test(testPrefix);
      expect(isMatch).toEqual(true);
    });

    it('should match space prefix', () => {
      const isMatch = getGradleDependencyIdRegEx().test(spacePrefix);
      expect(isMatch).toEqual(true);
    });

    it('should match all formats', () => {
      const dependencyIdRegEx = getGradleDependencyIdRegEx();

      dependencyIdRegEx.exec(allFormats);
      expect(dependencyIdRegEx.lastIndex).toEqual(50);

      dependencyIdRegEx.exec(allFormats);
      expect(dependencyIdRegEx.lastIndex).toEqual(85);

      dependencyIdRegEx.exec(allFormats);
      expect(dependencyIdRegEx.lastIndex).toEqual(149);

      dependencyIdRegEx.exec(allFormats);
      expect(dependencyIdRegEx.lastIndex).toEqual(213);

      dependencyIdRegEx.exec(allFormats);
      expect(dependencyIdRegEx.lastIndex).toEqual(285);

      dependencyIdRegEx.exec(allFormats);
      expect(dependencyIdRegEx.lastIndex).toEqual(0);
    });
  });
});
