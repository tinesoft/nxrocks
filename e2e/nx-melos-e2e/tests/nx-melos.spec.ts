import { checkFilesExist, runNxCommandAsync } from '@nx/plugin/testing';
import { ensureNxProjectWithDeps } from '@nxrocks/common/testing';

describe('nx-melos e2e', () => {
  beforeAll(async () => {
    ensureNxProjectWithDeps('@nxrocks/nx-melos', 'dist/packages/nx-melos', [
      { name: '@nxrocks/common', path: 'dist/packages/common' },
    ]);
  }, 600000);

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  beforeEach(() => {});

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize melos in the workspace', async () => {
    await runNxCommandAsync(
      `generate @nxrocks/nx-melos:init --scriptNameSeparator="-"`
    );

    const scripts = [
      {
        name: 'melos-bootstrap',
        output: `NX   Successfully ran target melos-bootstrap for project proj`,
      },
    ];

    let totalExecutorsTime = 0;
    for (const script of scripts) {
      const start = new Date().getTime();
      const result = await runNxCommandAsync(script.name);
      const end = new Date().getTime();
      console.log(`${script.name} took ${end - start}ms`);
      totalExecutorsTime += end - start;
      expect(result.stdout).toContain(script.output);
    }
    console.log(`Total executors time: ${totalExecutorsTime}ms`);

    expect(() => checkFilesExist(`melos.yaml`)).not.toThrow();
  }, 400000);
});
