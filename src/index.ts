import { defineEndpoint } from '@directus/extensions-sdk';
import { createError } from '@directus/errors';
import {
  generateUserToken,
  generateCallToken,
  validateStreamConfig,
} from './streamio.js';

const MissingUserIdError = createError(
  'MISSING_USER_ID',
  'userId is required in request body',
  400
);
const MissingCallIdsError = createError(
  'MISSING_CALL_IDS',
  'callIds must be a non-empty array of call identifiers',
  400
);
const ConfigurationError = createError(
  'STREAMIO_CONFIG_ERROR',
  'Stream is not properly configured',
  500
);

export default defineEndpoint((router, context) => {
  const { env, logger } = context;

  /**
   * GET /getstream-io/health
   * Health check endpoint to verify extension is loaded and configured
   */
  router.get('/health', (_req, res) => {
    const config = validateStreamConfig(env);

    res.json({
      status: 'ok',
      extension: 'directus-extension-getstream-io',
      configured: config.valid,
      errors: config.errors,
      endpoints: [
        'GET /getstream-io/health',
        'POST /getstream-io/userToken',
        'POST /getstream-io/callToken',
      ],
    });
  });

  /**
   * POST /getstream-io/userToken
   * Generate a Stream user token
   *
   * Request body:
   * {
   *   "userId": "string",           // Required: User ID for the token
   *   "expirationSeconds": number   // Optional: Token expiration in seconds (default: 1 hour)
   * }
   */
  router.post('/userToken', async (req, res, next) => {
    try {
      const { userId, expirationSeconds } = req.body;

      // Validate required fields
      if (!userId) {
        throw new MissingUserIdError();
      }

      // Validate configuration
      const config = validateStreamConfig(env);
      if (!config.valid) {
        logger.error(
          { details: config.errors },
          'Stream configuration is invalid'
        );
        throw new ConfigurationError();
      }

      // Generate user token
      const token = await generateUserToken({
        apiKey: env.STREAMIO_API_KEY as string,
        apiSecret: env.STREAMIO_API_SECRET as string,
        userId,
        expirationSeconds,
      });

      logger.info({ userId, type: 'user' }, 'Generated Stream user token');
      res.json(token);
    } catch (error) {
      logger.error(
        { error, userId: req.body.userId },
        'Error generating Stream user token'
      );
      next(error);
    }
  });

  /**
   * POST /getstream-io/callToken
   * Generate a Stream call token with access to specific calls
   *
   * Request body:
   * {
   *   "userId": "string",           // Required: User ID for the token
   *   "callIds": ["string"],        // Required: Array of call IDs (e.g., ["default:call1", "livestream:call2"])
   *   "role": "string",             // Optional: Role for the calls (e.g., "admin", "moderator")
   *   "expirationSeconds": number   // Optional: Token expiration in seconds (default: 1 hour)
   * }
   */
  router.post('/callToken', async (req, res, next) => {
    try {
      const { userId, callIds, role, expirationSeconds } = req.body;

      // Validate required fields
      if (!userId) {
        throw new MissingUserIdError();
      }

      if (!callIds || !Array.isArray(callIds) || callIds.length === 0) {
        throw new MissingCallIdsError();
      }

      // Validate configuration
      const config = validateStreamConfig(env);
      if (!config.valid) {
        logger.error(
          { details: config.errors },
          'Stream configuration is invalid'
        );
        throw new ConfigurationError();
      }

      // Generate call token
      const token = await generateCallToken({
        apiKey: env.STREAMIO_API_KEY as string,
        apiSecret: env.STREAMIO_API_SECRET as string,
        userId,
        callIds,
        role,
        expirationSeconds,
      });

      logger.info(
        { userId, callIds, role, type: 'call' },
        'Generated Stream call token'
      );
      res.json(token);
    } catch (error) {
      logger.error(
        { error, userId: req.body.userId, callIds: req.body.callIds },
        'Error generating Stream call token'
      );
      next(error);
    }
  });

  /**
   * POST /getstream-io/generate
   * Generate a Stream user token (legacy endpoint for backward compatibility)
   *
   * @deprecated Use /getstream-io/userToken instead
   */
  router.post('/generate', async (req, res, next) => {
    try {
      const { userId, expirationSeconds } = req.body;

      if (!userId) {
        throw new MissingUserIdError();
      }

      const config = validateStreamConfig(env);
      if (!config.valid) {
        logger.error(
          { details: config.errors },
          'Stream configuration is invalid'
        );
        throw new ConfigurationError();
      }

      const tokenResponse = await generateUserToken({
        apiKey: env.STREAMIO_API_KEY as string,
        apiSecret: env.STREAMIO_API_SECRET as string,
        userId,
        expirationSeconds,
      });

      logger.info(
        { userId, type: 'user', endpoint: 'legacy' },
        'Generated Stream user token (legacy endpoint)'
      );
      res.json(tokenResponse);
    } catch (error) {
      logger.error(
        { error, userId: req.body.userId },
        'Error generating Stream token (legacy endpoint)'
      );
      next(error);
    }
  });
});
