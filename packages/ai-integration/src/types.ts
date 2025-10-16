/**
 * AI integration types
 */

export interface AIModelMetadata {
  id: string;
  name: string;
  version: string;
  walrusHash: string;
  type: "ml" | "llm" | "rl" | "gnn" | "lstm" | "prophet";
  description: string;
}

export interface AIInferenceRequest {
  modelId: string;
  input: any;
  requireTEE?: boolean;
}

export interface AIInferenceResult {
  output: any;
  confidence?: number;
  attestation?: any;
  executionTimeMs: number;
}
