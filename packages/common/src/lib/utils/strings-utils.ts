// credits: https://github.com/angular/angular-cli/blob/master/packages/angular_devkit/core/src/utils/literals.ts


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stripIndent(strings: TemplateStringsArray, ...values: any[]) {
    const endResult = String.raw(strings, ...values);
  
    // remove the shortest leading indentation from each line
    const match = endResult.match(/^[ \t]*(?=\S)/gm);
  
    // return early if there's nothing to strip
    if (match === null) {
      return endResult;
    }
  
    const indent = Math.min(...match.map((el) => el.length));
    const regexp = new RegExp('^[ \\t]{' + indent + '}', 'gm');
  
    return (indent > 0 ? endResult.replace(regexp, '') : endResult).trim();
  }