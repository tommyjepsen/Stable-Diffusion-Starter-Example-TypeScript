import * as Generation from "./generation/generation_pb";

import {
  buildGenerationRequest,
  executeGenerationRequest,
  onGenerationComplete,
} from "./helpers";

import { grpc as GRPCWeb } from "@improbable-eng/grpc-web";
import { GenerationServiceClient } from "./generation/generation_pb_service";
import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";

require("dotenv").config();

GRPCWeb.setDefaultTransport(NodeHttpTransport());

const metadata = new GRPCWeb.Metadata();
metadata.set("Authorization", "Bearer " + process.env.API_KEY);

const client = new GenerationServiceClient("https://grpc.stability.ai", {});

const request = buildGenerationRequest("stable-diffusion-512-v2-1", {
  type: "text-to-image",
  prompts: [
    {
      text: "A dream of a distant galaxy, by Caspar David Friedrich, matte painting trending on artstation HQ",
    },
  ],
  width: 512,
  height: 512,
  samples: 1,
  cfgScale: 13,
  steps: 25,
  sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M,
});

executeGenerationRequest(client, request, metadata)
  .then(onGenerationComplete)
  .catch((error) => {
    console.error("Failed to make text-to-image request:", error);
  });
