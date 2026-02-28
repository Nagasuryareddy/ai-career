import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath } = await req.json();
    if (!filePath) {
      throw new Error("filePath is required");
    }

    // Download file from storage
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("resumes")
      .download(filePath);

    if (downloadError || !fileData) {
      throw new Error(`Failed to download file: ${downloadError?.message}`);
    }

    // Convert file to base64
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Determine MIME type
    const ext = filePath.split(".").pop()?.toLowerCase();
    const mimeType =
      ext === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    // Call Lovable AI (Gemini) to analyze
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const aiResponse = await fetch(
      "https://ai-gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this resume document thoroughly. Return a JSON object with EXACTLY this structure (no markdown, no code fences, just raw JSON):
{
  "summary": {
    "name": "Full name",
    "title": "Professional title/role",
    "summary": "Professional summary paragraph",
    "skills": ["skill1", "skill2"],
    "education": [{"degree": "Degree name", "school": "School name"}],
    "certifications": ["cert1", "cert2"],
    "experience": [{"role": "Job title", "company": "Company", "years": "Date range"}],
    "achievements": ["achievement1", "achievement2"]
  },
  "insights": {
    "score": 75,
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "missingSkills": ["skill1", "skill2"],
    "recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5"]
  },
  "skillDistribution": [
    {"name": "Technical", "value": 40},
    {"name": "Analytical", "value": 25},
    {"name": "Communication", "value": 15},
    {"name": "Leadership", "value": 10},
    {"name": "Domain", "value": 10}
  ],
  "skillMatchData": [
    {"skill": "SkillName", "match": 85}
  ],
  "jobRecommendations": [
    {
      "id": 1,
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "match": 90,
      "url": "#",
      "description": "Brief job description"
    }
  ]
}

Important:
- score should be 0-100 based on resume quality
- skillMatchData should have 5-7 entries for the candidate's top skills
- jobRecommendations should have 5 relevant job matches
- All values should be realistic and based on the actual resume content
- skillDistribution values should sum to 100`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 4000,
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI API call failed [${aiResponse.status}]: ${errText}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from AI");
    }

    // Parse the JSON response, stripping any markdown fences
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const analysis = JSON.parse(cleaned);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error analyzing resume:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
