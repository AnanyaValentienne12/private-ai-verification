import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseRequirement } from "../ai/policy-parser";
import { createApp } from "../api/app";
import { AppError } from "../utils/errors";

vi.mock("../ai/policy-parser", () => ({
  parseRequirement: vi.fn(),
}));

const mockedParse = vi.mocked(parseRequirement);

describe("POST /api/policy/parse", () => {
  beforeEach(() => {
    mockedParse.mockReset();
  });

  it("returns a normalized policy for a valid request", async () => {
    mockedParse.mockResolvedValue({
      version: 1,
      logic: "AND",
      rules: [
        { field: "age", operator: ">=", value: 21 },
        { field: "income", operator: ">=", value: 4000, unit: "USD_MONTHLY" },
      ],
    });

    const response = await request(createApp())
      .post("/api/policy/parse")
      .send({ requirement: "Applicant must be 21+ and earn at least $4,000/month." });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.policy.rules).toHaveLength(2);
    expect(response.body.publicCriteria).toEqual({ minAge: 21, minIncome: 4000 });
    expect(response.body.midnightCompatible).toBe(true);
  });

  it("returns midnightCompatible false for OR policies Compact cannot prove", async () => {
    mockedParse.mockResolvedValue({
      version: 1,
      logic: "OR",
      rules: [
        { field: "age", operator: ">=", value: 21 },
        { field: "income", operator: ">=", value: 4000, unit: "USD_MONTHLY" },
      ],
    });

    const response = await request(createApp())
      .post("/api/policy/parse")
      .send({ requirement: "Applicant must be 21+ or earn at least $4,000/month." });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.publicCriteria).toBeNull();
    expect(response.body.midnightCompatible).toBe(false);
  });

  it("rejects an empty requirement", async () => {
    const response = await request(createApp())
      .post("/api/policy/parse")
      .send({ requirement: "" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("INVALID_REQUEST");
    expect(mockedParse).not.toHaveBeenCalled();
  });

  it("rejects whitespace-only requirement", async () => {
    const response = await request(createApp())
      .post("/api/policy/parse")
      .send({ requirement: "   " });

    expect(response.status).toBe(400);
    expect(mockedParse).not.toHaveBeenCalled();
  });

  it("rejects applicant private fields on the request body", async () => {
    const response = await request(createApp())
      .post("/api/policy/parse")
      .send({
        requirement: "Applicant must be at least 21.",
        age: 23,
        income: 5000,
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_REQUEST");
    expect(mockedParse).not.toHaveBeenCalled();
  });

  it("rejects invalid JSON bodies", async () => {
    const response = await request(createApp())
      .post("/api/policy/parse")
      .set("Content-Type", "application/json")
      .send("{");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_REQUEST");
    expect(mockedParse).not.toHaveBeenCalled();
  });

  it("rejects a missing requirement", async () => {
    const response = await request(createApp()).post("/api/policy/parse").send({});

    expect(response.status).toBe(400);
    expect(mockedParse).not.toHaveBeenCalled();
  });

  it("rejects applicant values without a requirement and does not evaluate them", async () => {
    const response = await request(createApp()).post("/api/policy/parse").send({
      age: 23,
      income: 5000,
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body).not.toHaveProperty("qualified");
    expect(response.body).not.toHaveProperty("policy");
    expect(mockedParse).not.toHaveBeenCalled();
  });

  it("rejects an oversized requirement", async () => {
    const response = await request(createApp())
      .post("/api/policy/parse")
      .send({ requirement: "A".repeat(4001) });

    expect(response.status).toBe(400);
    expect(mockedParse).not.toHaveBeenCalled();
  });

  it("does not expose a verify endpoint", async () => {
    const response = await request(createApp()).post("/verify").send({ age: 23, income: 5000 });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("rejects GET on the parse endpoint", async () => {
    const response = await request(createApp()).get("/api/policy/parse");

    expect(response.status).toBe(404);
    expect(mockedParse).not.toHaveBeenCalled();
  });

  it("returns 422 when the AI output is malformed", async () => {
    mockedParse.mockRejectedValue(
      new AppError(
        422,
        "INVALID_POLICY",
        "The requirement could not be converted into a supported policy.",
      ),
    );

    const response = await request(createApp())
      .post("/api/policy/parse")
      .send({ requirement: "Applicant must be at least 21." });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe("INVALID_POLICY");
  });

  it("returns 502 without leaking provider details", async () => {
    mockedParse.mockRejectedValue(
      new AppError(502, "AI_PROVIDER_ERROR", "The eligibility requirement could not be processed."),
    );

    const response = await request(createApp())
      .post("/api/policy/parse")
      .send({ requirement: "Applicant must be at least 21." });

    expect(response.status).toBe(502);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: "AI_PROVIDER_ERROR",
        message: "The eligibility requirement could not be processed.",
      },
    });
    expect(JSON.stringify(response.body)).not.toMatch(/api[_-]?key/i);
    expect(response.body.error).not.toHaveProperty("stack");
  });

  it("returns 422 for unsupported fields", async () => {
    mockedParse.mockRejectedValue(
      new AppError(
        422,
        "UNSUPPORTED_POLICY",
        "The requirement could not be converted into a supported policy.",
      ),
    );

    const response = await request(createApp())
      .post("/api/policy/parse")
      .send({ requirement: "Applicant must have a credit score above 750." });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe("UNSUPPORTED_POLICY");
  });
});

describe("GET /health", () => {
  it("returns ok", async () => {
    const response = await request(createApp()).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "eligibility-backend",
    });
  });
});
