# @bun-move/ai-integration

AI/TEE integration package for TortoiseOS.

## Features

- **Walrus Storage**: Decentralized storage for AI model weights and datasets
- **Nautilus TEE**: Trusted Execution Environment for secure AI inference
- **Model Management**: Store, retrieve, and version AI models

## Usage

### Walrus Storage

```typescript
import { createWalrusClient } from "@bun-move/ai-integration";

const walrus = createWalrusClient({
  endpoint: process.env.WALRUS_ENDPOINT!,
  bucketId: process.env.WALRUS_BUCKET_ID,
});

// Store model weights
const hash = await walrus.storeModelWeights("model-v1", weights);

// Retrieve model weights
const weights = await walrus.retrieveModelWeights(hash);
```

### Nautilus TEE

```typescript
import { createNautilusClient } from "@bun-move/ai-integration";

const nautilus = createNautilusClient({
  endpoint: process.env.NAUTILUS_TEE_ENDPOINT!,
  apiKey: process.env.NAUTILUS_API_KEY,
});

// Execute in TEE
const { result, attestation } = await nautilus.executeInTEE(modelHash, input);

// Verify attestation
const valid = await nautilus.verifyAttestation(attestation);
```

## Configuration

Set environment variables:

```bash
WALRUS_ENDPOINT=https://walrus-testnet.mystenlabs.com
WALRUS_BUCKET_ID=your-bucket-id
NAUTILUS_TEE_ENDPOINT=your-tee-endpoint
NAUTILUS_API_KEY=your-api-key
```

## AI Models in TortoiseOS

1. **AMM Adaptive Fee Oracle**: ML volatility model
2. **Vault RL Optimizer**: Reinforcement learning for yield optimization
3. **Stablecoin NFT Valuator**: Vision + NLP for NFT collateral valuation
4. **Arb GNN Signal Generator**: Graph neural network for arbitrage detection
5. **Bridge Route Selector**: LangChain multi-agent for cross-chain routing
6. **RWA Provenance Auditor**: LLM for document fraud detection
7. **BTCfi Correlat forecast**: LSTM for BTC-SUI correlation prediction
8. **Privacy Vault Optimizer**: Homomorphic encryption + EZKL proofs
9. **Prediction Oracle**: Ensemble AI resolvers
10. **Orderbook Prophet Forecaster**: Prophet-based liquidity prediction

## License

MIT
