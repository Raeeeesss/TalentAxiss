import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedCandidate {
  name?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  currentRole?: string;
  currentCompany?: string;
  totalExperience?: number;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: number;
  skills?: string[];
  languages?: string[];
  education?: Array<{ degree: string; institution: string; year?: string }>;
  workHistory?: Array<{ company: string; role: string; duration: string }>;
  certifications?: string[];
  hasPassport?: boolean;
  passportNumber?: string;
  hasDrivingLicense?: boolean;
  gulfExperience?: boolean;
  gulfCountries?: string[];
  summary?: string;
}

export async function parseCVWithAI(text: string): Promise<ParsedCandidate> {
  const prompt = `Extract structured information from this resume/CV text. Return a JSON object with the following fields (use null for missing fields):
  name, phone, email, dateOfBirth (ISO format), gender (Male/Female/Other), address, city, district (Kerala district if applicable), state,
  currentRole, currentCompany, totalExperience (number in years), currentSalary (number in INR), expectedSalary (number in INR),
  noticePeriod (number in days), skills (array of strings), languages (array of strings),
  education (array of {degree, institution, year}), workHistory (array of {company, role, duration}),
  certifications (array), hasPassport (boolean), passportNumber, hasDrivingLicense (boolean),
  gulfExperience (boolean), gulfCountries (array), summary (2-3 line professional summary).

  CV Text:
  ${text.slice(0, 4000)}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.1,
  });

  try {
    return JSON.parse(response.choices[0].message.content || "{}");
  } catch {
    return {};
  }
}

export interface MatchResult {
  candidateId: string;
  score: number;
  tier: "BEST_FIT" | "GOOD_FIT" | "TRAINABLE_FIT";
  reasons: string[];
  gaps: string[];
}

export async function matchCandidatesWithAI(
  job: {
    title: string;
    skills: string[];
    minExperience?: number;
    maxExperience?: number;
    minSalary?: number;
    maxSalary?: number;
    location?: string;
    description?: string;
  },
  candidates: Array<{
    id: string;
    name: string;
    skills: string[];
    totalExperience?: number;
    expectedSalary?: number;
    city?: string;
    district?: string;
    currentRole?: string;
  }>
): Promise<MatchResult[]> {
  const prompt = `You are an expert recruitment AI. Score each candidate for this job opening.

Job: ${JSON.stringify(job)}
Candidates: ${JSON.stringify(candidates)}

For each candidate, return a JSON array with objects containing:
- candidateId: string
- score: number (0-100)
- tier: "BEST_FIT" (80-100), "GOOD_FIT" (60-79), or "TRAINABLE_FIT" (40-59) — omit candidates below 40
- reasons: array of strings (why they match)
- gaps: array of strings (what they're missing)

Return only the JSON array.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.1,
  });

  try {
    const parsed = JSON.parse(response.choices[0].message.content || "{}");
    const results = parsed.results || parsed.candidates || parsed || [];
    return Array.isArray(results) ? results : [];
  } catch {
    return [];
  }
}

export async function detectFakeProfile(candidateData: {
  name: string;
  skills: string[];
  totalExperience?: number;
  education?: unknown[];
  workHistory?: unknown[];
  resumeText?: string;
}): Promise<{ score: number; flags: string[] }> {
  const prompt = `Analyze this candidate profile for signs of fabrication or exaggeration.
  Profile: ${JSON.stringify(candidateData)}

  Return JSON: { "score": number (0-100, higher = more suspicious), "flags": string[] }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.1,
  });

  try {
    return JSON.parse(response.choices[0].message.content || '{"score":0,"flags":[]}');
  } catch {
    return { score: 0, flags: [] };
  }
}

export async function calculateBackoutRisk(data: {
  daysToJoining: number;
  responseDelay: number;
  salaryDiff: number;
  multipleOffers: boolean;
  previousBackouts: number;
}): Promise<{ risk: number; level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; factors: string[] }> {
  let risk = 0;
  const factors: string[] = [];

  if (data.daysToJoining > 30) { risk += 20; factors.push("Long notice period"); }
  if (data.responseDelay > 3) { risk += 25; factors.push("Slow to respond"); }
  if (data.salaryDiff > 20) { risk += 20; factors.push("Salary gap > 20%"); }
  if (data.multipleOffers) { risk += 25; factors.push("Multiple offers in hand"); }
  if (data.previousBackouts > 0) { risk += data.previousBackouts * 15; factors.push("Previous backout history"); }

  risk = Math.min(100, risk);
  const level = risk >= 75 ? "CRITICAL" : risk >= 50 ? "HIGH" : risk >= 25 ? "MEDIUM" : "LOW";

  return { risk, level, factors };
}
