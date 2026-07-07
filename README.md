<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=250&section=header&text=InsightPulse&fontSize=80&desc=No-code%20Data%20Analytics%20%26%20ETL&descSize=20&descAlignY=60" width="100%" />

# 📊 InsightPulse


**A Lightning-Fast, No-Code Data Analytics & ETL Tool**

[![Live Demo](https://img.shields.io/badge/Live_Demo-InsightPulse-blue?style=for-the-badge&logo=vercel)](https://insight-pulse-omega.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Arpan-max/InsightPulse.git)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

<a href="https://insight-pulse-omega.vercel.app/">
  <img src="https://readme-typing-svg.herokuapp.com?font=Space+Grotesk&weight=600&size=26&duration=3000&pause=1000&color=2563EB&center=true&vCenter=true&width=600&lines=No-Code+ETL+Pipelines;Interactive+Auto-Dashboards;In-Browser+Data+Processing;Export+Ready" alt="Typing SVG" />
</a>

</div>

<br/>

## 🌟 Overview

**InsightPulse** empowers non-technical users to process, clean, and visualize data without writing a single line of code. Built entirely on the client-side with React, it processes CSVs directly in the browser, ensuring complete privacy and blazing-fast performance.

Upload a CSV, build a transformation pipeline step-by-step, and watch the interactive dashboard update in real-time.

## ✨ Key Features

- 🛠️ **No-Code ETL Pipeline**: Add steps like *Drop Nulls*, *Filter*, *Group By*, and *Add Computed Columns* using an intuitive UI.
- ⚡ **Live Recompute Engine**: See changes instantly as you modify or reorder pipeline steps. No loading spinners.
- 📊 **Auto-Generated Dashboards**: Instantly get statistical profiles, null counts, and automatic bar charts for your data.
- 📈 **Custom Chart Builder**: Explore your transformed dataset using an integrated Recharts visualizer.
- 🔒 **100% Client-Side**: Your data never leaves your browser. All parsing and transformations happen locally.
- 📥 **Export to CSV**: Download your cleaned, transformed dataset with a single click.

## 🏗️ Architecture & Engineering

This project was engineered with a strict **Decoupled Architecture**, ensuring high maintainability and extensibility. 

The application is split into two distinct domains:
1. **Pipeline Engine**: A pure data-transformation layer.
2. **Dashboard UI**: A presentation layer that knows nothing about specific pipeline steps.

Adding a new data transformation step **does not require touching any Dashboard UI code**. The system uses a Registry Pattern where new steps are defined independently and automatically injected into the UI and executor.

### 🗂️ Project Structure

```text
src/
├── pipeline/
│   ├── types.ts              # Core interfaces (PipelineStepDef)
│   ├── registry.ts           # Central registry for all steps
│   ├── executor.ts           # Pipeline engine running steps over raw data
│   └── steps.tsx             # Implementations of individual transformations
├── dashboard/
│   ├── Sidebar.tsx           # Pipeline builder UI
│   ├── DataPreview.tsx       # Raw & transformed tabular preview
│   ├── SummaryStats.tsx      # Automatic statistical profiling
│   ├── AutoCharts.tsx        # Smart categorical bar charts
│   └── CustomChartBuilder.tsx# Interactive Recharts builder
└── App.tsx                   # Main layout coordinator
```

## 🛠️ Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
</p>

- **CSV Processing**: [PapaParse](https://www.papaparse.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)

## 🚀 Getting Started

To run this project locally:

```bash
# 1. Clone the repository
git clone https://github.com/Arpan-max/InsightPulse.git
cd InsightPulse

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

## 📝 How to Add a New Step (For Developers)

The decoupled architecture makes it incredibly easy to extend InsightPulse. To add a new transformation (e.g., "Sort Data"):
1. Open `src/pipeline/steps.tsx`.
2. Define a new `PipelineStepDef` object containing its `id`, `label`, `renderConfig` (React UI), and `apply` (Transformation logic).
3. Register it in `src/pipeline/registry.ts`.
*That's it! The step will automatically appear in the UI and function perfectly without any dashboard modifications.*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  <i>Crafted with passion for clean data and clean code.</i>
</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=150&section=footer" width="100%" />
