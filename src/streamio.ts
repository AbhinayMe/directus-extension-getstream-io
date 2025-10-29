/**
 * Stream.io Video Token Generator
 * 
 * This module generates authentication tokens for Stream.io video calls.
 * Uses the official @stream-io/node-sdk to generate user tokens and call tokens via JWT.
 * 
 * Requires STREAMIO_API_KEY and STREAMIO_API_SECRET environment variables.
 * 
 * @see https://getstream.io/video/docs/api/authentication/#user-tokens
 * @see https://getstream.io/video/docs/api/authentication/#call-tokens
 */

import { StreamClient } from '@stream-io/node-sdk';

export interface StreamTokenConfig {
  apiKey: string;
  apiSecret: string;
  userId: string;
  expirationSeconds?: number;
}

export interface StreamCallTokenConfig {
  apiKey: string;
  apiSecret: string;
  userId: string;
  callIds: string[];
  role?: string;
  expirationSeconds?: number;
}

export interface StreamTokenResponse {
  token: string;
  userId: string;
  apiKey: string;
  expiresAt?: Date;
  type: 'user' | 'call';
  callIds?: string[];
  role?: string;
}

/**
 * Generate a Stream.io user token for a given user
 * 
 * Stream uses JWT (JSON Web Tokens) to authenticate users. Tokens need to be 
 * generated server-side. If no expiration is provided, the token is valid for 
 * 1 hour by default (as per Stream.io API defaults).
 * 
 * User tokens enable users to log in and are managed separately from call-specific
 * permissions via a role-based permissions system.
 * 
 * @param config - Token configuration including API credentials and user ID
 * @returns Promise resolving to token response with token string and metadata
 * @throws Error if API credentials are missing or token generation fails
 * 
 * @see https://getstream.io/video/docs/api/authentication/#user-tokens
 */
export async function generateUserToken(
  config: StreamTokenConfig
): Promise<StreamTokenResponse> {
  const { apiKey, apiSecret, userId, expirationSeconds } = config;

  if (!apiKey || !apiSecret) {
    throw new Error('Stream.io API key and secret are required');
  }

  if (!userId) {
    throw new Error('User ID is required to generate a token');
  }

  try {
    // Initialize Stream Video client with API credentials
    const client = new StreamClient(apiKey, apiSecret);

    // Generate user token with optional expiration
    // validity_in_seconds is optional - if not provided, token is valid for 1 hour by default
    const token = client.generateUserToken({ 
      user_id: userId,
      validity_in_seconds: expirationSeconds
    });

    const response: StreamTokenResponse = {
      token,
      userId,
      apiKey,
      type: 'user',
    };

    if (expirationSeconds) {
      // Calculate expiration date based on current time + validity seconds
      const expirationTime = Math.floor(Date.now() / 1000) + expirationSeconds;
      response.expiresAt = new Date(expirationTime * 1000);
    }

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate Stream.io user token: ${errorMessage}`);
  }
}

/**
 * Generate a Stream.io call token for a user with access to specific calls
 * 
 * Call tokens contain a list of call IDs. When a user utilizes a call token, they
 * will automatically be assigned the membership role for all the calls specified
 * in the token's claims. The token may optionally include alternative roles such
 * as admin or moderator.
 * 
 * Note: Call tokens are designed to grant additional access, not restrict it.
 * Most call types let regular users join calls. If all users can access any call,
 * call tokens won't change this. Remove call access from the user role and grant
 * it to specific members instead.
 * 
 * @param config - Token configuration including API credentials, user ID, call IDs, and optional role
 * @returns Promise resolving to token response with token string and metadata
 * @throws Error if API credentials are missing or token generation fails
 * 
 * @see https://getstream.io/video/docs/api/authentication/#call-tokens
 */
export async function generateCallToken(
  config: StreamCallTokenConfig
): Promise<StreamTokenResponse> {
  const { apiKey, apiSecret, userId, callIds, role, expirationSeconds } = config;

  if (!apiKey || !apiSecret) {
    throw new Error('Stream.io API key and secret are required');
  }

  if (!userId) {
    throw new Error('User ID is required to generate a call token');
  }

  if (!callIds || callIds.length === 0) {
    throw new Error('At least one call ID is required to generate a call token');
  }

  try {
    // Initialize Stream Video client with API credentials
    const client = new StreamClient(apiKey, apiSecret);

    // Generate call token with call IDs and optional role
    // validity_in_seconds is optional - if not provided, token is valid for 1 hour by default
    const tokenParams: {
      user_id: string;
      call_cids: string[];
      validity_in_seconds?: number;
      role?: string;
    } = {
      user_id: userId,
      call_cids: callIds,
    };

    if (expirationSeconds) {
      tokenParams.validity_in_seconds = expirationSeconds;
    }

    if (role) {
      tokenParams.role = role;
    }

    const token = client.generateCallToken(tokenParams);

    const response: StreamTokenResponse = {
      token,
      userId,
      apiKey,
      type: 'call',
      callIds,
    };

    if (role) {
      response.role = role;
    }

    if (expirationSeconds) {
      // Calculate expiration date based on current time + validity seconds
      const expirationTime = Math.floor(Date.now() / 1000) + expirationSeconds;
      response.expiresAt = new Date(expirationTime * 1000);
    }

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate Stream.io call token: ${errorMessage}`);
  }
}

/**
 * Generate a Stream.io token (user or call token based on configuration)
 * 
 * This is a convenience function that routes to the appropriate token generation
 * method based on whether call IDs are provided.
 * 
 * @deprecated Use generateUserToken() or generateCallToken() directly for better type safety
 */
export async function generateStreamToken(
  config: StreamTokenConfig
): Promise<StreamTokenResponse> {
  // For backward compatibility, this function generates user tokens
  return generateUserToken(config);
}

/**
 * Validate Stream.io environment configuration
 * 
 * @param env - Environment variables object (from Directus context or process.env)
 * @returns Object with validation status and any error messages
 */
export function validateStreamConfig(env: Record<string, unknown> = process.env): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!env.STREAMIO_API_KEY) {
    errors.push('STREAMIO_API_KEY environment variable is not set');
  }

  if (!env.STREAMIO_API_SECRET) {
    errors.push('STREAMIO_API_SECRET environment variable is not set');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
