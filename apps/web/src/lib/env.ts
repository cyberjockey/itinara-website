/**
 * Environment Variable Validation
 * Ensures all required environment variables are present at runtime
 */

const REQUIRED_ENV_VARS = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_SECRET',
    'TELEGRAM_BOT_TOKEN',
    'GROQ_API_KEY',
    'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET',
] as const;

export function validateEnv() {
    const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

    if (missing.length > 0) {
        const errorMessage = [
            '❌ Missing required environment variables:',
            ...missing.map(key => `  - ${key}`),
            '',
            'Please check your .env file and ensure all required variables are set.',
        ].join('\n');

        throw new Error(errorMessage);
    }

    console.log('✅ All required environment variables are present');
}

/**
 * Get environment variable with type safety
 */
export function getEnv(key: typeof REQUIRED_ENV_VARS[number]): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}
