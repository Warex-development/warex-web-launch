# WareX — Nepal's Premier Industrial Equipments & Parts Exchange

WareX is a professional B2B industrial e-commerce ecosystem designed to redefine how industries in Nepal manage and source equipment and spare parts. By connecting factories with idle inventory to those with urgent requirements, WareX helps reduce waste, unlock working capital, and improve operational efficiency across the industrial sector.

## 🚀 Launching Soon: 30th May 2026

The platform is currently in its **Launch Campaign Phase**. All interactive features (member registration, listing submission, and direct sourcing) are temporarily gated to build community momentum and ensure high-quality data validation before the official go-live.

### Current Features (Public Beta):
- **Industrial Ecosystem Preview**: Explore the sectors and categories we are targeting.
- **Why WareX**: Learn about our value-added services, including technical validation and escrow facilitation.
- **Global Launch Countdown**: Real-time tracking of the May 30th launch.
- **Membership Preview**: Detailed breakdown of upcoming membership tiers.

## 🛠️ Technology Stack
- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS & Framer Motion (Premium Animations)
- **Icons**: Lucide React
- **Backend (Target)**: Supabase / PostgreSQL

## 📦 Project Structure
- `/src/pages/public`: Core informational pages (About, Why WareX, Membership, etc.)
- `/src/pages/member`: Member-only dashboard features (Gated)
- `/src/pages/admin`: Administrative management console (Gated)
- `/src/components`: Reusable UI components and the Global Launch Gate

## 🚦 Deployment Notes
This repository is configured for the **Pre-Launch Phase**. 
- The global `click` interceptor in `App.jsx` redirects all action-oriented routes to `/launching-soon`.
- Public informational routes (`/about`, `/why-warex`, `/how-it-works`) remain accessible for marketing purposes.

---
© 2026 WareX Industrial Ecosystems. All Rights Reserved.
