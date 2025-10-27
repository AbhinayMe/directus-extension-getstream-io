import { defineEndpoint } from '@directus/extensions-sdk';
import { generateUserToken, generateCallToken, validateStreamConfig } from './streamio.js';

export default defineEndpoint((router) => {
	/**
	 * GET /streamio-token/health
	 * Health check endpoint to verify extension is loaded and configured
	 */
	router.get('/health', (_req, res) => {
		const config = validateStreamConfig();
		
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
	router.post('/user', async (req, res) => {
		try {
			const { userId, expirationSeconds } = req.body;

			// Validate required fields
			if (!userId) {
				return res.status(400).json({
					error: 'Bad Request',
					message: 'userId is required in request body',
				});
			}

			// Validate configuration
			const config = validateStreamConfig();
			if (!config.valid) {
				return res.status(500).json({
					error: 'Configuration Error',
					message: 'Stream.io is not properly configured',
					details: config.errors,
				});
			}

			// Generate user token
			const tokenResponse = await generateUserToken({
				apiKey: process.env.STREAMIO_API_KEY!,
				apiSecret: process.env.STREAMIO_API_SECRET!,
				userId,
				expirationSeconds,
			});

			res.json(tokenResponse);
		} catch (error) {
			console.error('Error generating Stream.io user token:', error);
			
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			res.status(500).json({
				error: 'Internal Server Error',
				message: errorMessage,
			});
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
	router.post('/call', async (req, res) => {
		try {
			const { userId, callIds, role, expirationSeconds } = req.body;

			// Validate required fields
			if (!userId) {
				return res.status(400).json({
					error: 'Bad Request',
					message: 'userId is required in request body',
				});
			}

			if (!callIds || !Array.isArray(callIds) || callIds.length === 0) {
				return res.status(400).json({
					error: 'Bad Request',
					message: 'callIds must be a non-empty array of call identifiers',
				});
			}

			// Validate configuration
			const config = validateStreamConfig();
			if (!config.valid) {
				return res.status(500).json({
					error: 'Configuration Error',
					message: 'Stream.io is not properly configured',
					details: config.errors,
				});
			}

			// Generate call token
			const tokenResponse = await generateCallToken({
				apiKey: process.env.STREAMIO_API_KEY!,
				apiSecret: process.env.STREAMIO_API_SECRET!,
				userId,
				callIds,
				role,
				expirationSeconds,
			});

			res.json(tokenResponse);
		} catch (error) {
			console.error('Error generating Stream.io call token:', error);
			
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			res.status(500).json({
				error: 'Internal Server Error',
				message: errorMessage,
			});
		}
	});

	/**
	 * POST /streamio-token/generate
	 * Generate a Stream.io user token (legacy endpoint for backward compatibility)
	 * 
	 * @deprecated Use /streamio-token/user instead
	 */
	router.post('/generate', async (req, res) => {
		try {
			const { userId, expirationSeconds } = req.body;

			if (!userId) {
				return res.status(400).json({
					error: 'Bad Request',
					message: 'userId is required in request body',
				});
			}

			const config = validateStreamConfig();
			if (!config.valid) {
				return res.status(500).json({
					error: 'Configuration Error',
					message: 'Stream.io is not properly configured',
					details: config.errors,
				});
			}

			const tokenResponse = await generateUserToken({
				apiKey: process.env.STREAMIO_API_KEY!,
				apiSecret: process.env.STREAMIO_API_SECRET!,
				userId,
				expirationSeconds,
			});

			res.json(tokenResponse);
		} catch (error) {
			console.error('Error generating Stream.io token:', error);
			
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			res.status(500).json({
				error: 'Internal Server Error',
				message: errorMessage,
			});
		}
	});
});
