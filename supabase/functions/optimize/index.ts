import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { start, destination, step_length } = await req.json();

    if (!start || !destination) {
      return new Response(
        JSON.stringify({ error: "Start and destination are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse coordinates or use defaults for mock
    const startCoords = parseCoords(start) || { lat: 12.9716, lng: 77.5946 }; // Bangalore
    const destCoords = parseCoords(destination) || { lat: 13.0827, lng: 80.2707 }; // Chennai

    // Generate mock RL route (slightly different path)
    const routeRl = generateMockRoute(startCoords, destCoords, 8, 0.02);
    const routeGoogle = generateMockRoute(startCoords, destCoords, 6, 0);

    const result = {
      rl_energy: 1327.45,
      google_energy: 1489.12,
      rl_time: 659,
      google_time: 715,
      route_rl: routeRl,
      route_google: routeGoogle,
      episodes: 600,
      converged: true,
    };

    // Insert into database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("routes").insert({
      start_location: start,
      destination: destination,
      step_length: step_length || 1000,
      rl_energy: result.rl_energy,
      google_energy: result.google_energy,
      rl_time: result.rl_time,
      google_time: result.google_time,
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function parseCoords(input: string): { lat: number; lng: number } | null {
  const match = input.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  }
  return null;
}

function generateMockRoute(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  points: number,
  offset: number
): [number, number][] {
  const route: [number, number][] = [[start.lat, start.lng]];
  for (let i = 1; i < points - 1; i++) {
    const t = i / (points - 1);
    const lat = start.lat + (end.lat - start.lat) * t + (Math.random() - 0.5) * offset;
    const lng = start.lng + (end.lng - start.lng) * t + (Math.random() - 0.5) * offset;
    route.push([lat, lng]);
  }
  route.push([end.lat, end.lng]);
  return route;
}
