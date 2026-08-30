# Private AI Verification

An AI-powered zero-knowledge verification engine, powered by midnight that validates user credentials against natural-language criteria without revealing sensitive user data on-chain.

## Details

* **What problem does our project solve?** It bridges natural-language requirements (e.g., job or financial eligibility rules) with private verification. Users can prove they satisfy parsed criteria like minimum age or income without disclosing their actual private details publicly.
* **Libraries / Services:** Midnight Network (Compact language for ZK circuits, `@midnight-ntwrk/proof-provider-wasm` running directly in the browser runtime), coupled with an AI LLM parser to extract structured rules into circuit parameters.
* **Scalability-** Implement multi-attribute credential verification circuits, integrate native Midnight wallet adapters (e.g., Lace), and add real-time proof status updates to the UI.

## Set Up Instructions (within your IDE Terminal)

1. **Clone the Repository & Install Dependencies**
    ```bash
    git clone [https://github.com/your-org/private-ai-verification.git](https://github.com/your-org/private-ai-verification.git)
    cd private-ai-verification
    npm install
   ```
2. **Follow the link below and download Release Windows Linux 0.19.0** <br>
   https://docs.midnight.network/relnotes/compact <br>
   Move the file to the cloned repository <br>
   Enter Linux and unzip:
   ```bash
   wsl
   cd {YOUR_DIRECTORY}
   unzip /mnt/{YOUR_DIRECTORY}/compactc-linux.zip -d ./compiler
   
3. **Install Global Midnight Tooling:**
   Install the Compact compiler globally via npm:
   ```bash
   npm install @midnight-ntwrk/midnight-js-http-client-proof-provider
   npm install @midnight-ntwrk/compact-runtime

4. **Compile Compact ZK Circuit:**
   ```bash
   compact compile enligibilityChecker.compact managed/eligibility
   npm run build
   ```
   **(If you can't compile):**<br>
   Run these and check for your index.ts (might be index.cjs or index.js as well)
   ```bash
   compact compile eligibilityChecker.compact managed/eligibility
   ls -l /home/{YOUR_USERNAME}/.local/bin/compact
   /home/{YOUR_USERNAME}/.local/bin/compact compile enligibilityChecker.compact managed/eligibility
   ls managed/eligibility
   ```
5. **Runs Typescript with Node.js:**
    ```bash
    npx ts-node mainAPI.ts
    npm install -D tsx
    ```
6. **After running npm build, to run testRun:**
    ```bash
    npx tsx testRun.ts
    ```
