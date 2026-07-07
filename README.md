# InsightPulse
A no-code data analytics tool that lets non-technical users build configurable ETL pipelines and explore auto-generated dashboards.

## Features
- **No-code ETL Pipeline**: Add steps like Drop Nulls, Filter, Group By, etc. without writing code.
- **Auto-Dashboards**: Get instant insights via summary stats and auto-generated charts.
- **Custom Chart Builder**: Explore your transformed data using interactive charts.
- **Live Recompute**: Instantly see changes as you modify your pipeline steps.
- **Export**: Export transformed data to CSV.
- **Live Sample Data**: Comes with a bundled `sample_sales.csv` for easy demoing.

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- PapaParse (for CSV processing)
- Recharts (for Data Visualizations)

*(Note: The architecture described below preserves the exact decoupled pattern requested for the original Python/Streamlit spec, adapted for a browser-native React environment to run perfectly on this platform).*

## Folder Structure
```
src/
├── pipeline/
│   ├── types.ts              (PipelineStep interfaces)
│   ├── registry.ts           (PIPELINE_STEPS dict — the only place steps are wired up)
│   ├── executor.ts           (Executes the pipeline steps over the raw data)
│   └── steps.tsx             (Individual step logic and config UI components)
├── dashboard/
│   ├── Sidebar.tsx           (Pipeline builder UI — imports registry.ts only)
│   ├── DataPreview.tsx       (Raw + transformed data preview)
│   ├── SummaryStats.tsx      (Data profile: mean, min, max, null counts)
│   ├── AutoCharts.tsx        (Auto bar charts for categorical columns)
│   └── CustomChartBuilder.tsx(User-driven Recharts chart builder)
└── App.tsx                   (Main layout connecting sidebar and dashboard tabs)
```
**Architecture Note**: Adding a new transformation step must never require touching any file under `dashboard/`. The dashboard code only iterates over `PIPELINE_STEPS` and calls generic `renderConfig()` and `apply()` methods.

**State Model Note**: All state is held in React state (`rawData`, `steps`, etc.) ensuring the pipeline re-computes optimally via React `useMemo` hooks.

## Local setup
1. Clone repository
2. Run `npm install`
3. Run `npm run dev`
4. Open the browser URL indicated by Vite.

## How it works
1. Upload a CSV file using the sidebar, or click "Use Sample Dataset".
2. Switch between the Data Preview, Pipeline Result, and Dashboard tabs.
3. Click "+ Add Step" in the sidebar to add a data transformation. 
4. Configure the step and watch the Dashboard and Pipeline Result tabs update live.

## How to add a new transformation step
Adding a new step is extremely simple and requires no UI changes to the dashboard or sidebar:
1. Open `src/pipeline/steps.tsx`.
2. Create a new `PipelineStepDef` object (defining `id`, `label`, `renderConfig` for its UI, and `apply` for its transformation logic).
3. Export it and add it to `PIPELINE_STEPS` inside `src/pipeline/registry.ts`.
The Sidebar will automatically pick it up, render its form, and the pipeline executor will run it!

## Manual Steps You Must Do Yourself
**A. Create a Virtual Environment / Install Packages**
Run `npm install` locally in the project directory.

**B. Push code to GitHub**
`git init`, `git add .`, `git commit -m "Initial commit"`, create a repo on GitHub, `git remote add origin <repo-url>`, `git push -u origin main`.

**C. Deploy on Vercel / Netlify / Cloudflare Pages**
1. Connect your GitHub repository to your preferred static hosting provider (e.g. Vercel).
2. Ensure the build command is `npm run build` and output directory is `dist`.
3. Deploy! No secrets or environment variables are needed for this project.

**D. Know the limits**
Since all data parsing and transformations happen directly in the browser memory, extremely large CSV files (e.g. hundreds of MBs) may cause the browser tab to slow down or crash. It is ideal for small to medium analytics datasets.
