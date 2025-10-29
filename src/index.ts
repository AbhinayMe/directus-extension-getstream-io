import { defineEndpoint } from '@directus/extensions-sdk';
import { createError } from '@directus/errors';
import { generateUserToken, generateCallToken, validateStreamConfig } from './streamio.js';

const MissingUserIdError = createError('MISSING_USER_ID', 'userId is required in request body', 400);
const MissingCallIdsError = createError('MISSING_CALL_IDS', 'callIds must be a non-empty array of call identifiers', 400);
const ConfigurationError = createError('STREAMIO_CONFIG_ERROR', 'Stream.io is not properly configured', 500);
const TokenGenerationError = createError('TOKEN_GENERATION_ERROR', 'Failed to generate Stream.io token', 500);

export default defineEndpoint((router, context) => {
	const { env, logger } = context;

	/**
	 * GET /streamio-token/health
	 * Health check endpoint to verify extension is loaded and configured
	 */
	router.get('/health', (_req, res) => {
		const config = validateStreamConfig(env);
		
		res.json({
			status: 'ok',
			extension: 'directus-extension-stream-token',
			configured: config.valid,
			errors: config.errors,
			endpoints: [
				'GET /streamio-token/health',
				'POST /streamio-token/user',
				'POST /streamio-token/call',
			],
		});
	});

	/**
	 * POST /streamio-token/user
	 * Generate a Stream.io user token
	 * 
	 * Request body:
	 * {
	 *   "userId": "string",           // Required: User ID for the token
	 *   "expirationSeconds": number   // Optional: Token expiration in seconds (default: 1 hour)
	 * }
	 */
	router.post('/user', async (req, res, next) => {
		try {
			const { userId, expirationSeconds } = req.body;

			// Validate required fields
			if (!userId) {
				throw new MissingUserIdError();
			}

			// Validate configuration
			const config = validateStreamConfig(env);
			if (!config.valid) {
				logger.error({ details: config.errors }, 'Stream.io configuration is invalid');
				throw new ConfigurationError({ details: config.errors });
			}

			// Generate user token
			const tokenResponse = await generateUserToken({
				apiKey: env.STREAMIO_API_KEY as string,
				apiSecret: env.STREAMIO_API_SECRET as string,
				userId,
				expirationSeconds,
			});

			logger.info({ userId, type: 'user' }, 'Generated Stream.io user token');
			res.json(tokenResponse);
		} catch (error) {
			logger.error({ error, userId: req.body.userId }, 'Error generating Stream.io user token');
			next(error);
		}
	});

	/**
	 * POST /streamio-token/call
	 * Generate a Stream.io call token with access to specific calls
	 * 
	 * Request body:
	 * {
	 *   "userId": "string",           // Required: User ID for the token
	 *   "callIds": ["string"],        // Required: Array of call IDs (e.g., ["default:call1", "livestream:call2"])
	 *   "role": "string",             // Optional: Role for the calls (e.g., "admin", "moderator")
	 *   "expirationSeconds": number   // Optional: Token expiration in seconds (default: 1 hour)
	 * }
	 */
	router.post('/call', async (req, res, next) => {
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
				logger.error({ details: config.errors }, 'Stream.io configuration is invalid');
				throw new ConfigurationError({ details: config.errors });
			}

			// Generate call token
			const tokenResponse = await generateCallToken({
				apiKey: env.STREAMIO_API_KEY as string,
				apiSecret: env.STREAMIO_API_SECRET as string,
				userId,
				callIds,
				role,
				expirationSeconds,
			});

			logger.info({ userId, callIds, role, type: 'call' }, 'Generated Stream.io call token');
			res.json(tokenResponse);
		} catch (error) {
			logger.error({ error, userId: req.body.userId, callIds: req.body.callIds }, 'Error generating Stream.io call token');
			next(error);
		}
	});

	/**
	 * POST /streamio-token/generate
	 * Generate a Stream.io user token (legacy endpoint for backward compatibility)
	 * 
	 * @deprecated Use /streamio-token/user instead
	 */
	router.post('/generate', async (req, res, next) => {
		try {
			const { userId, expirationSeconds } = req.body;

			if (!userId) {
				throw new MissingUserIdError();
			}

			const config = validateStreamConfig(env);
			if (!config.valid) {
				logger.error({ details: config.errors }, 'Stream.io configuration is invalid');
				throw new ConfigurationError({ details: config.errors });
			}

			const tokenResponse = await generateUserToken({
				apiKey: env.STREAMIO_API_KEY as string,
				apiSecret: env.STREAMIO_API_SECRET as string,
				userId,
				expirationSeconds,
			});

			logger.info({ userId, type: 'user', endpoint: 'legacy' }, 'Generated Stream.io user token (legacy endpoint)');
			res.json(tokenResponse);
		} catch (error) {
			logger.error({ error, userId: req.body.userId }, 'Error generating Stream.io token (legacy endpoint)');
			next(error);
		}
	});
});
