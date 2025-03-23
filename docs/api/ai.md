# AI API

The AI API provides endpoints for leveraging AI capabilities in the CoAI platform, including task suggestions, contributions to existing tasks, and skill recommendations.

## Get Task Suggestions

Retrieves AI-generated suggestions for completing a task based on provided details.

**URL**: `/api/ai/suggestions`

**Method**: `POST`

**Authentication**: Required

**Request Body**:

```json
{
  "title": "Build a Solana dApp",
  "description": "Create a simple dApp that interacts with Solana blockchain",
  "category": "Development",
  "requiredSkills": ["Solana", "React", "JavaScript"]
}
```

**Successful Response** (Status 200):

```json
{
  "suggestions": [
    {
      "title": "Approach 1: Modular Development with React and Solana/Web3.js",
      "content": "Break down the dApp development into modular components: wallet integration, blockchain transactions, and UI. Start by setting up a React environment with Solana/web3.js integration...",
      "estimatedTime": "40-60 hours",
      "recommendedResources": [
        "Solana Web3.js Documentation",
        "Solana Program Library",
        "React Component Architecture Guide"
      ]
    },
    {
      "title": "Approach 2: Scaffold with Solana Boilerplate",
      "content": "Utilize existing Solana dApp boilerplates to quickly set up the foundation. Customize the UI/UX with React components and implement specific blockchain interactions...",
      "estimatedTime": "30-45 hours",
      "recommendedResources": [
        "Solana dApp Scaffold",
        "Anchor Framework Documentation",
        "React Hooks for Web3"
      ]
    },
    {
      "title": "Approach 3: Anchor Framework with TypeScript",
      "content": "Implement the dApp using Anchor framework with TypeScript for improved type safety and developer experience. Create clear separation between on-chain programs and client-side code...",
      "estimatedTime": "50-70 hours",
      "recommendedResources": [
        "Anchor Framework Documentation",
        "TypeScript Best Practices",
        "Solana Program Architecture"
      ]
    }
  ]
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 400: Missing required fields
- Status 500: Error generating suggestions

## Contribute to Task

Requests AI assistance and contributions for a specific task.

**URL**: `/api/ai/contribute/:taskId`

**Method**: `POST`

**Authentication**: Required (must be task creator or assignee)

**URL Parameters**:

- `taskId`: Task ID

**Request Body**:

```json
{
  "query": "How can I implement the wallet connection functionality for the Solana dApp?"
}
```

**Successful Response** (Status 200):

```json
{
  "contribution": {
    "id": "60d21b4667d0d8992e610c94",
    "task": "60d21b4667d0d8992e610c85",
    "requestedBy": "60d21b4667d0d8992e610c88",
    "query": "How can I implement the wallet connection functionality for the Solana dApp?",
    "content": "To implement wallet connection functionality for your Solana dApp:\n\n1. **Setup Dependencies**:\n   ```bash\n   npm install @solana/wallet-adapter-react @solana/wallet-adapter-base @solana/wallet-adapter-wallets @solana/web3.js\n   ```\n\n2. **Configure Wallet Providers**:\n   ```jsx\n   import React from 'react';\n   import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';\n   import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';\n   import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';\n   import { clusterApiUrl } from '@solana/web3.js';\n   \n   const network = WalletAdapterNetwork.Devnet;\n   const endpoint = clusterApiUrl(network);\n   \n   const wallets = [\n     new PhantomWalletAdapter(),\n     new SolflareWalletAdapter(),\n   ];\n   \n   export default function App({ children }) {\n     return (\n       <ConnectionProvider endpoint={endpoint}>\n         <WalletProvider wallets={wallets} autoConnect>\n           {children}\n         </WalletProvider>\n       </ConnectionProvider>\n     );\n   }\n   ```\n\n3. **Create Wallet Connection Button**:\n   ```jsx\n   import { useWallet } from '@solana/wallet-adapter-react';\n   import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';\n   import '@solana/wallet-adapter-react-ui/styles.css';\n   \n   function WalletConnection() {\n     const { wallet, connected } = useWallet();\n     \n     return (\n       <div>\n         <WalletMultiButton />\n         {connected && <p>Connected to: {wallet.adapter.name}</p>}\n       </div>\n     );\n   }\n   ```\n\n4. **Access Account Information**:\n   ```jsx\n   import { useWallet } from '@solana/wallet-adapter-react';\n   import { useEffect, useState } from 'react';\n   import { Connection, clusterApiUrl } from '@solana/web3.js';\n   \n   function AccountInfo() {\n     const { publicKey, connected } = useWallet();\n     const [balance, setBalance] = useState(0);\n     \n     useEffect(() => {\n       if (connected && publicKey) {\n         const getBalance = async () => {\n           const connection = new Connection(clusterApiUrl('devnet'));\n           const balance = await connection.getBalance(publicKey);\n           setBalance(balance / 1000000000); // Convert lamports to SOL\n         };\n         getBalance();\n       }\n     }, [connected, publicKey]);\n     \n     return (\n       <div>\n         {connected && publicKey ? (\n           <div>\n             <p>Address: {publicKey.toString()}</p>\n             <p>Balance: {balance} SOL</p>\n           </div>\n         ) : (\n           <p>Connect your wallet to view account info</p>\n         )}\n       </div>\n     );\n   }\n   ```\n\nMake sure to handle errors appropriately, especially in the balance fetching logic. Also, consider implementing a loading state while fetching the balance.",
    "createdAt": "2023-06-19T13:45:15.426Z"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 403: Not authorized (not task creator or assignee)
- Status 404: Task not found
- Status 400: Missing query
- Status 500: Error generating contribution

## Get Skill Recommendations

Retrieves AI-generated skill recommendations based on the user's existing skills.

**URL**: `/api/ai/skill-recommendations`

**Method**: `GET`

**Authentication**: Required

**Successful Response** (Status 200):

```json
{
  "recommendations": [
    {
      "skill": "Rust",
      "reason": "Based on your JavaScript and Solana skills, learning Rust would enable you to develop custom Solana programs and smart contracts, which is essential for advanced Solana development.",
      "resources": [
        "The Rust Programming Language Book",
        "Solana Program Development with Rust",
        "Rust by Example"
      ]
    },
    {
      "skill": "TypeScript",
      "reason": "As you're already proficient in JavaScript and React, TypeScript would be a natural next step to improve code quality, maintainability, and developer experience in your projects.",
      "resources": [
        "TypeScript Handbook",
        "TypeScript with React",
        "Effective TypeScript: 62 Specific Ways to Improve Your TypeScript"
      ]
    },
    {
      "skill": "Web3.js",
      "reason": "This library is crucial for interacting with Solana blockchain from JavaScript applications, complementing your existing Solana and JavaScript knowledge.",
      "resources": [
        "Solana Web3.js Documentation",
        "Building DApps with Web3.js",
        "Solana Cookbook"
      ]
    }
  ]
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 400: No skills found for user
- Status 500: Error generating recommendations 