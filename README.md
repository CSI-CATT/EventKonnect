# 🎉 EventKonnect

Maintainer: [Aditya Jambhale](https://github.com/Aditya-jambhale)

EventKonnect is an **open-source Event Management Platform** built with [Next.js](https://nextjs.org/).  
It helps organizers **create, manage, and promote events**, while attendees can **book, like, and get notified** about upcoming ones.  

This repository is part of **Hacktoberfest** 🍂 – contributions are welcome!

## ✨ Features (Planned & Ongoing)

- 🔐 **User Authentication** (Sign In / Sign Up with Firebase & NextAuth)  
- 🎟️ **Create & Manage Events**  
- 📅 **Event Booking System**  
- 🔔 **Notifications & Reminders**  
- 📊 **Admin Dashboard with Analytics** (Recharts)  
- 🎨 **Modern UI** with Tailwind + shadcn/ui + Radix UI  
- 📱 **Responsive Design + PWA support**

## 📁 Folder Structure

eventkonnect/
├── app/ # Next.js App Router pages & API routes
│ ├── admin/ # Admin dashboard, analytics, create-event
│ ├── api/ # API routes for AI + backend integration
│ ├── create-event/ # Event creation forms
│ ├── events/ # Event listing & details
│ ├── notifications/ # User notifications
│ ├── profile/ # User profile
│ ├── signIn/ # Login page
│ ├── signup/ # Register page
│ ├── Eventdetails.jsx # Single event view
│ ├── layout.js # Root layout
│ └── page.js # Homepage
│
├── components/ # Shared UI components
│ ├── ui/ # UI widgets (cards, forms, modals)
│ └── dashboard/ # Dashboard-specific components
│
├── lib/ # Firebase config, utils, and helpers
├── public/ # Static assets (icons, manifest, images)
├── styles/ # Global styles (Tailwind, globals.css)
├── data/ # Mock/static data for testing
├── .env.local.example # Example environment variables
├── package.json
└── tailwind.config.js

## 💻 Technologies Used

| Category | Technologies |
|-----------|--------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Frontend** | React 18, TailwindCSS, shadcn/ui, Radix UI, Framer Motion |
| **Backend / APIs** | Next.js API Routes, Firebase, Axios |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) + Firebase |
| **State Management** | Redux Toolkit |
| **Forms & Validation** | React Hook Form + Zod |
| **Charts & Analytics** | Recharts |
| **UI Enhancements** | React Icons, Lucide, Toastify, SweetAlert2 |
| **Utilities** | date-fns, uuid, dotenv |
| **PWA Support** | next-pwa + Workbox |
| **Hosting** | Firebase Hosting / Vercel (Recommended) |

## 🌱 About Hacktoberfest

EventKonnect is part of **[Hacktoberfest](https://hacktoberfest.com/)** — a month-long celebration of **open source** held every October 🎃.  

It’s an opportunity to:
- 🧠 Learn Git & GitHub through hands-on contributions  
- 🌍 Collaborate with developers across the world  
- 🚀 Contribute to real projects (like EventKonnect!)  
- 🎁 Earn digital rewards and recognition  

We welcome all levels of contributors — from beginners to experts!

## 🚀 How to Run the Project Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/EventKonnect.git
cd EventKonnect
```

### 2️⃣ Install Dependencies
Make sure you have **Node.js (v18+)** installed.
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3️⃣ Configure Environment Variables
Create a file named `.env.local` in the project root:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
GROQ_API_KEY=your_groq_api_key_here
```

### 4️⃣ Run the Development Server
```bash
npm run dev
```
Now open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### 5️⃣ (Optional) Build for Production
```bash
npm run build
npm start
```

## 🧭 How to Fork and Contribute (Git & GitHub Basics)

Follow these simple steps to make your first contribution 👇

### 🪄 Step 1 — Fork the Repository
- Go to [EventKonnect Repo](https://github.com/CSI-CATT/EventKonnect)
- Click on **“Fork”** in the top right corner

### 🪄 Step 2 — Clone Your Fork Locally
```bash
git clone https://github.com/<your-username>/EventKonnect.git
cd EventKonnect
```

### 🪄 Step 3 — Create a New Branch
```bash
git checkout -b feature-name
```

### 🪄 Step 4 — Make Your Changes
Edit files, fix bugs, or improve documentation.

### 🪄 Step 5 — Stage and Commit
```bash
git add .
git commit -m "feat: describe your change"
```

### 🪄 Step 6 — Push Your Branch
```bash
git push origin feature-name
```

### 🪄 Step 7 — Submit a Pull Request
- Go to your fork on GitHub  
- Click **“Compare & pull request”**  
- Add a clear title and description  
- Submit the PR 🎉  

Your contribution will be reviewed and merged soon!