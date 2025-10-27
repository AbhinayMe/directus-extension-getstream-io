import { generateUserToken, generateCallToken, generateStreamToken, validateStreamConfig } from '../src/streamio';

describe('Stream.io Token Generation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('validateStreamConfig', () => {
    it('should return valid when all required env vars are set', () => {
      process.env.STREAMIO_API_KEY = 'test-api-key';
      process.env.STREAMIO_API_SECRET = 'test-api-secret';

      const result = validateStreamConfig();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid when API key is missing', () => {
      delete process.env.STREAMIO_API_KEY;
      process.env.STREAMIO_API_SECRET = 'test-api-secret';

      const result = validateStreamConfig();

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('STREAMIO_API_KEY environment variable is not set');
    });

    it('should return invalid when API secret is missing', () => {
      process.env.STREAMIO_API_KEY = 'test-api-key';
      delete process.env.STREAMIO_API_SECRET;

      const result = validateStreamConfig();

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('STREAMIO_API_SECRET environment variable is not set');
    });

    it('should return invalid when both credentials are missing', () => {
      delete process.env.STREAMIO_API_KEY;
      delete process.env.STREAMIO_API_SECRET;

      const result = validateStreamConfig();

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe('generateUserToken', () => {
    it('should throw error when API key is missing', async () => {
      await expect(
        generateUserToken({
          apiKey: '',
          apiSecret: 'secret',
          userId: 'user-123',
        })
      ).rejects.toThrow('Stream.io API key and secret are required');
    });

    it('should throw error when API secret is missing', async () => {
      await expect(
        generateUserToken({
          apiKey: 'key',
          apiSecret: '',
          userId: 'user-123',
        })
      ).rejects.toThrow('Stream.io API key and secret are required');
    });

    it('should throw error when user ID is missing', async () => {
      await expect(
        generateUserToken({
          apiKey: 'key',
          apiSecret: 'secret',
          userId: '',
        })
      ).rejects.toThrow('User ID is required to generate a token');
    });

    it('should return a user token response with required fields', async () => {
      const config = {
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
        userId: 'user-123',
      };

      const result = await generateUserToken(config);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('userId', 'user-123');
      expect(result).toHaveProperty('apiKey', 'test-api-key');
      expect(result).toHaveProperty('type', 'user');
      expect(typeof result.token).toBe('string');
      expect(result.token.length).toBeGreaterThan(0);
    });

    it('should include expiration date when expirationSeconds is provided', async () => {
      const config = {
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
        userId: 'user-123',
        expirationSeconds: 3600,
      };

      const result = await generateUserToken(config);

      expect(result).toHaveProperty('expiresAt');
      expect(result.expiresAt).toBeInstanceOf(Date);
      
      // Check that expiration is roughly 1 hour from now
      const now = Date.now();
      const expirationTime = result.expiresAt!.getTime();
      const timeDiff = expirationTime - now;
      
      // Allow 5 second margin for test execution time
      expect(timeDiff).toBeGreaterThan(3595000); // 3595 seconds
      expect(timeDiff).toBeLessThan(3605000); // 3605 seconds
    });
  });

  describe('generateCallToken', () => {
    it('should throw error when API key is missing', async () => {
      await expect(
        generateCallToken({
          apiKey: '',
          apiSecret: 'secret',
          userId: 'user-123',
          callIds: ['default:call1'],
        })
      ).rejects.toThrow('Stream.io API key and secret are required');
    });

    it('should throw error when API secret is missing', async () => {
      await expect(
        generateCallToken({
          apiKey: 'key',
          apiSecret: '',
          userId: 'user-123',
          callIds: ['default:call1'],
        })
      ).rejects.toThrow('Stream.io API key and secret are required');
    });

    it('should throw error when user ID is missing', async () => {
      await expect(
        generateCallToken({
          apiKey: 'key',
          apiSecret: 'secret',
          userId: '',
          callIds: ['default:call1'],
        })
      ).rejects.toThrow('User ID is required to generate a call token');
    });

    it('should throw error when call IDs are missing', async () => {
      await expect(
        generateCallToken({
          apiKey: 'key',
          apiSecret: 'secret',
          userId: 'user-123',
          callIds: [],
        })
      ).rejects.toThrow('At least one call ID is required to generate a call token');
    });

    it('should return a call token response with required fields', async () => {
      const config = {
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
        userId: 'user-123',
        callIds: ['default:call1', 'livestream:call2'],
      };

      const result = await generateCallToken(config);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('userId', 'user-123');
      expect(result).toHaveProperty('apiKey', 'test-api-key');
      expect(result).toHaveProperty('type', 'call');
      expect(result).toHaveProperty('callIds');
      expect(result.callIds).toEqual(['default:call1', 'livestream:call2']);
      expect(typeof result.token).toBe('string');
      expect(result.token.length).toBeGreaterThan(0);
    });

    it('should include role when provided', async () => {
      const config = {
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
        userId: 'user-123',
        callIds: ['default:call1'],
        role: 'admin',
      };

      const result = await generateCallToken(config);

      expect(result).toHaveProperty('role', 'admin');
    });

    it('should include expiration date when expirationSeconds is provided', async () => {
      const config = {
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
        userId: 'user-123',
        callIds: ['default:call1'],
        expirationSeconds: 3600,
      };

      const result = await generateCallToken(config);

      expect(result).toHaveProperty('expiresAt');
      expect(result.expiresAt).toBeInstanceOf(Date);
      
      const now = Date.now();
      const expirationTime = result.expiresAt!.getTime();
      const timeDiff = expirationTime - now;
      
      expect(timeDiff).toBeGreaterThan(3595000);
      expect(timeDiff).toBeLessThan(3605000);
    });
  });

  describe('generateStreamToken (legacy)', () => {
    it('should generate user token for backward compatibility', async () => {
      const config = {
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
        userId: 'user-123',
      };

      const result = await generateStreamToken(config);

      expect(result).toHaveProperty('type', 'user');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('userId', 'user-123');
    });
  });
});
