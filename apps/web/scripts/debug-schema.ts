
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkPlaceSchema() {
    const { data: places, error } = await supabase
        .from("places")
        .select("*")
        .limit(1);

    if (error) {
        console.error("Error:", error);
        return;
    }

    console.log("Place record:", JSON.stringify(places[0], null, 2));
}

checkPlaceSchema();
