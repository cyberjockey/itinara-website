
import { generateCoordinates } from '../apps/crm/src/app/dashboard/places/actions';

async function test() {
    console.log("Testing AI Coordinate Generation...");
    const result = await generateCoordinates("Monas", "Jakarta");
    console.log("Result for Monas, Jakarta:", result);

    if (result && result.lat && result.lng) {
        console.log("SUCCESS: Coordinates generated.");
    } else {
        console.error("FAILURE: No coordinates return.");
    }
}

test();
