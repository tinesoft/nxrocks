import { ExecutorContext } from '@nx/devkit';
import { execSync } from 'child_process';
import ionicExecutor, { IonicExecutorOptions } from './ionic.impl';

jest.mock('child_process');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe('Ionic Executor', () => {
  let context: ExecutorContext;

  beforeEach(() => {
    context = {
      root: '/root',
      cwd: '/root',
      projectName: 'test-app',
      targetName: 'build',
      projectGraph: {
        nodes: {},
        dependencies: {},
      },
      projectsConfigurations: {
        version: 2,
        projects: {
          'test-app': {
            root: 'apps/test-app',
            projectType: 'application',
          },
        },
      },
      nxJsonConfiguration: {},
      isVerbose: false,
    };

    jest.clearAllMocks();
  });

  describe('successful execution', () => {
    it('should execute ionic command successfully', async () => {
      const options: IonicExecutorOptions = {
        command: 'ionic build',
      };

      mockExecSync.mockReturnValue(Buffer.from('Build successful'));

      const result = await ionicExecutor(options, context);

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith('ionic build', {
        stdio: 'inherit',
        cwd: '/root',
      });
    });

    it('should execute ionic command with args successfully', async () => {
      const options: IonicExecutorOptions = {
        command: 'ionic build',
        args: ['--prod', '--verbose'],
      };

      mockExecSync.mockReturnValue(Buffer.from('Build successful'));

      const result = await ionicExecutor(options, context);

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        'ionic build --prod --verbose',
        {
          stdio: 'inherit',
          cwd: '/root',
        }
      );
    });

    it('should execute ionic command with custom cwd', async () => {
      const options: IonicExecutorOptions = {
        command: 'ionic serve',
        cwd: '/custom/path',
      };

      mockExecSync.mockReturnValue(Buffer.from('Server started'));

      const result = await ionicExecutor(options, context);

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith('ionic serve', {
        stdio: 'inherit',
        cwd: '/custom/path',
      });
    });

    it('should handle empty args array', async () => {
      const options: IonicExecutorOptions = {
        command: 'ionic info',
        args: [],
      };

      mockExecSync.mockReturnValue(Buffer.from('Ionic info'));

      const result = await ionicExecutor(options, context);

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith('ionic info', {
        stdio: 'inherit',
        cwd: '/root',
      });
    });
  });

  describe('failed execution', () => {
    it('should return failure when command throws error', async () => {
      const options: IonicExecutorOptions = {
        command: 'ionic build',
      };

      mockExecSync.mockImplementation(() => {
        throw new Error('Command failed');
      });

      const result = await ionicExecutor(options, context);

      expect(result.success).toBe(false);
      expect(mockExecSync).toHaveBeenCalledWith('ionic build', {
        stdio: 'inherit',
        cwd: '/root',
      });
    });

    it('should return failure when command fails with exit code', async () => {
      const options: IonicExecutorOptions = {
        command: 'ionic build --invalid-flag',
        args: ['--prod'],
      };

      const error = new Error('Command failed') as Error & { status: number };
      error.status = 1;
      mockExecSync.mockImplementation(() => {
        throw error;
      });

      const result = await ionicExecutor(options, context);

      expect(result.success).toBe(false);
      expect(mockExecSync).toHaveBeenCalledWith(
        'ionic build --invalid-flag --prod',
        {
          stdio: 'inherit',
          cwd: '/root',
        }
      );
    });
  });

  describe('command construction', () => {
    it('should handle complex command with multiple args', async () => {
      const options: IonicExecutorOptions = {
        command: 'ionic capacitor build',
        args: ['ios', '--prod', '--release', '--device'],
      };

      mockExecSync.mockReturnValue(Buffer.from('Build successful'));

      const result = await ionicExecutor(options, context);

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        'ionic capacitor build ios --prod --release --device',
        {
          stdio: 'inherit',
          cwd: '/root',
        }
      );
    });

    it('should handle args with spaces and quotes', async () => {
      const options: IonicExecutorOptions = {
        command: 'ionic generate',
        args: ['component', 'my component', '--spec=false'],
      };

      mockExecSync.mockReturnValue(Buffer.from('Generated component'));

      const result = await ionicExecutor(options, context);

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        'ionic generate component my component --spec=false',
        {
          stdio: 'inherit',
          cwd: '/root',
        }
      );
    });
  });

  describe('edge cases', () => {
    it('should handle undefined args', async () => {
      const options: IonicExecutorOptions = {
        command: 'ionic version',
        args: undefined,
      };

      mockExecSync.mockReturnValue(Buffer.from('6.20.1'));

      const result = await ionicExecutor(options, context);

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith('ionic version', {
        stdio: 'inherit',
        cwd: '/root',
      });
    });

    it('should handle null args', async () => {
      const options: IonicExecutorOptions = {
        command: 'ionic config get',
        args: null as unknown as string[],
      };

      mockExecSync.mockReturnValue(Buffer.from('Config output'));

      const result = await ionicExecutor(options, context);

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith('ionic config get', {
        stdio: 'inherit',
        cwd: '/root',
      });
    });
  });
});
