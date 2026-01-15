
import dotenv from 'dotenv';
dotenv.config({ path: 'apps/crm/.env' });
// Note: We need to point to the correct env file, or assume the user has set it in the shell.
// Since we are running from root, path might be 'apps/crm/.env' or just '.env' if they added it there.

import { generateCoordinates } from '../apps/crm/src/app/dashboard/places/actions';

async function test() {
    console.log("Testing AI Coordinate Generation with Gemini...");

    if (!process.env.GEMINI_API_KEY) {
        console.warn("WARNING: GEMINI_API_KEY not found in environment. Test will likely fallback to Nominatim.");
    } else {
        console.log("GEMINI_API_KEY found.");
    }

    const result = await generateCoordinates("Monas", "Jakarta");
    console.log("Result for Monas, Jakarta:", result);

    if (result && result.lat && result.lng) {
        console.log("SUCCESS: Coordinates generated.");
    } else {
        console.error("FAILURE: No coordinates return.");
    }
}

test();
