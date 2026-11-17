// Which AI answers the questions. Users can also switch from the menu in the header.
//   "demo"   – keyword search over the documents, no AI model (works everywhere)
//   "webllm" – local AI that runs inside the browser (Edge/Chrome with WebGPU). Nothing leaves the device.
//   "ollama" – local AI served by Ollama on this computer. Nothing leaves the device.
//   "claude" – cloud AI through the Cloudflare Worker in /worker (needs claude.url)
export const AI = {
  provider: "webllm",

  webllm: {
    // ~2 GB download the first time, then cached by the browser.
    // Smaller/faster: "Qwen2.5-1.5B-Instruct-q4f16_1-MLC". Better quality: "Qwen2.5-7B-Instruct-q4f16_1-MLC".
    model: "Qwen2.5-3B-Instruct-q4f16_1-MLC",
    // If the company network blocks huggingface.co, copy the model folder to an internal server
    // and put its address here, e.g. "https://intranet.example/models/Qwen2.5-3B-Instruct-q4f16_1-MLC/".
    modelUrl: "",
    modelLibUrl: "", // optional: internal copy of the model's .wasm file
  },

  ollama: {
    url: "http://localhost:11434",
    model: "qwen2.5:7b", // install with: ollama pull qwen2.5:7b
  },

  claude: {
    url: "", // e.g. "https://ecm-assistant.<your-subdomain>.workers.dev"
  },
};
