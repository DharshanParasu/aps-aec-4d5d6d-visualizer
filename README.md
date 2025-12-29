# APS AEC 4D/5D/6D Visualizer

A full-stack web application for visualizing 4D (Schedule), 5D (Cost), and 6D (Sustainability) BIM data using Autodesk Platform Services (APS) and the AEC Data Model API.

![Preview][Application](https://github.com/user-attachments/assets/b2472f8c-73ec-4e37-b05a-c855cd469aa4)!


## Features

- **APS Authentication**: 3-legged OAuth integration with Autodesk Platform Services
- **Project Browser**: Navigate through ACC/BIM 360 hubs, projects, and folders
- **3D Model Viewer**: View models with element selection and property display
- **4D Schedule View**: Timeline with Gantt-style visualization, playback controls, and construction status
- **5D Cost View**: Cost aggregation by category with interactive charts and tables
- **6D Sustainability View**: Embodied carbon metrics, recyclable content, and energy performance
- **Extensibility**: Read and write custom properties via AEC Data Model GraphQL API

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **APIs**: APS Viewer SDK, AEC Data Model GraphQL API

## Prerequisites

- Node.js 18+ 
- An Autodesk Platform Services account with:
  - An application (Client ID & Client Secret)
  - Access to ACC/BIM 360 projects with AEC Data Model enabled

## Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd aps-aec-4d5d6d-visualizer

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```env
# APS Credentials
APS_CLIENT_ID=your_client_id_here
APS_CLIENT_SECRET=your_client_secret_here
APS_CALLBACK_URL=http://localhost:3001/api/auth/callback

# Server Config
PORT=3001

# AEC Data Model GraphQL Endpoint
AEC_DM_GRAPHQL_URL=https://developer.api.autodesk.com/aec/graphql
```

### 3. Configure APS Application

In your [Autodesk Developer Portal](https://aps.autodesk.com/myapps):

1. Add callback URL: `http://localhost:3001/api/auth/callback`
2. Enable required scopes: `data:read`, `data:write`, `data:create`, `account:read`, `user:read`

### 4. Run the Application

```bash
# Terminal 1: Start the backend server
cd server
npm run dev

# Terminal 2: Start the frontend
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
aps-aec-4d5d6d-visualizer/
├── client/                     # Next.js frontend
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # React components
│   │   │   ├── Viewer.tsx     # APS Viewer wrapper
│   │   │   ├── ModelSelector.tsx
│   │   │   ├── PropertyPanel.tsx
│   │   │   ├── TimelineView.tsx    # 4D
│   │   │   ├── CostView.tsx        # 5D
│   │   │   └── SustainabilityView.tsx # 6D
│   │   ├── contexts/          # React contexts
│   │   └── config.ts          # Client configuration
│   └── package.json
├── server/                     # Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts        # OAuth routes
│   │   │   ├── data.ts        # Data Management API
│   │   │   └── graphql.ts     # GraphQL proxy
│   │   ├── services/
│   │   │   ├── aecDataService.ts
│   │   │   └── aecDataQueries.ts
│   │   └── index.ts           # Server entry
│   ├── .env.example
│   └── package.json
└── README.md
```

## GraphQL Queries/Mutations Examples

### Reading Element Properties

```graphql
query GetElementProperties($projectId: ID!, $elementId: ID!) {
  aecElementProperties(projectId: $projectId, elementId: $elementId) {
    id
    name
    category
    properties {
      name
      value
      displayValue
    }
    customProperties {
      name
      value
    }
  }
}
```

### Writing Custom Properties (Extensibility)

```graphql
mutation UpdateCustomProperty(
  $projectId: ID!, 
  $elementId: ID!, 
  $propertyName: String!, 
  $propertyValue: String!
) {
  updateAecElementProperty(
    input: {
      projectId: $projectId
      elementId: $elementId
      property: {
        name: $propertyName
        value: $propertyValue
        type: "string"
      }
    }
  ) {
    success
    element {
      id
      customProperties {
        name
        value
      }
    }
  }
}
```

### Custom Properties Used

| Property | View | Description |
|----------|------|-------------|
| `PlannedStart` | 4D | Start date for construction |
| `PlannedFinish` | 4D | Finish date for construction |
| `ConstructionStatus` | 4D | not_started, in_progress, completed, delayed |
| `Phase` | 4D | Construction phase name |
| `UnitCost` | 5D | Cost per unit |
| `CostCode` | 5D | Cost tracking code |
| `Supplier` | 5D | Material supplier |
| `EmbodiedCarbon` | 6D | kgCO₂e value |
| `EnergyPerformance` | 6D | A+, A, B, C, etc. |
| `RecyclableContent` | 6D | Percentage recyclable |

## API Endpoints

### Authentication
- `GET /api/auth/url` - Get OAuth authorization URL
- `GET /api/auth/callback` - OAuth callback handler
- `GET /api/auth/token` - Get current access token
- `GET /api/auth/logout` - Clear session

### Data Management
- `GET /api/data/hubs` - List all hubs
- `GET /api/data/hubs/:hubId/projects` - List projects in hub
- `GET /api/data/projects/:projectId/topFolders` - Get top folders
- `GET /api/data/projects/:projectId/folders/:folderId/contents` - Get folder contents

### GraphQL
- `POST /api/graphql` - Proxy to AEC Data Model GraphQL API

## License

MIT
