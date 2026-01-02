**Mixo Ads - Frontend Engineer Challenge**

**About**

- **Description**: Mixo Ads builds AI-driven advertising tools for multi-location brands.

**The Challenge**

- **Goal**: Build a campaign monitoring dashboard that consumes the provided backend API and presents campaign performance in a usable way.

**What I Built**

- **Functional dashboard**: Campaign list, campaign detail with metrics, live insights stream.
- **Routing**: Client-side routing with React Router v6.
- **API client**: Axios-based API helper with SSE support for live updates.

**Tech Stack**

- **Framework**: React (Vite)
- **Language**: TypeScript
- **Routing**: react-router-dom
- **HTTP**: axios
- **Styling**: Tailwind CSS

**Local Setup**

- **Install dependencies**: `npm install`
- **Run dev server**: `npm run dev`
- **Typecheck**: `npm run typecheck`

**Environment**

- **Base URL**: Configure `VITE_BASE_URL` in the project root `.env` file. Example:

  VITE_BASE_URL=https://fe-task.app

**Available Scripts**

- **dev**: `npm run dev` — starts Vite dev server
- **build**: `npm run build` — builds production bundle
- **preview**: `npm run preview` — preview built app
- **typecheck**: `npm run typecheck` — TypeScript typecheck
