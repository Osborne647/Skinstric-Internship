export async function POST(req) {
  const body = await req.json();
  console.log("Image length:", body.image?.length);
  console.log("Image starts with:", body.image?.substring(0, 30));

  const response = await fetch(
    "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: body.image }),
    }
  );

  const data = await response.json();
  console.log("Skinstric response:", data);
  return Response.json(data);
}