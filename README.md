# 🎓 Khulna Association — Digital Platform

A full-stack **Next.js + MongoDB + Better Auth** web application for the **Khulna Division Association** at Netrokona University. Members can register, connect, RSVP to events, post in the forum, and more. Admins can manage approvals, roles, and content.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Prerequisites](#-prerequisites)
5. [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
   - [Step 1 — Clone the Repository](#step-1--clone-the-repository)
   - [Step 2 — Install Dependencies](#step-2--install-dependencies)
   - [Step 3 — Set Environment Variables](#step-3--set-environment-variables)
   - [Step 4 — Seed Reference Data](#step-4--seed-reference-data)
   - [Step 5 — Start the Development Server](#step-5--start-the-development-server)
   - [Step 6 — Register Your Account](#step-6--register-your-account)
   - [Step 7 — Generate the Admin Password (Create Superadmin)](#step-7--generate-the-admin-password-create-superadmin)
   - [Step 8 — Access the Admin Panel](#step-8--access-the-admin-panel)
6. [Deploying to Vercel](#-deploying-to-vercel)
   - [One-Repo Setup (Recommended)](#one-repo-setup-recommended)
   - [Environment Variables on Vercel](#environment-variables-on-vercel)
7. [Role System](#-role-system)
8. [API Reference](#-api-reference)
9. [MongoDB Collections](#-mongodb-collections)
10. [Troubleshooting](#-troubleshooting)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Better Auth (email/password) with secure session cookies |
| 👥 **Member Directory** | Searchable, filterable directory — name, dept, district, blood group |
| 🏛️ **Committee Management** | Current & past committee positions with year tracking |
| 📅 **Events & RSVP** | Create events, RSVP system with attendee count |
| 💬 **Community Forum** | Category posts (Jobs, Guidance, News, General) with comments |
| 📊 **Admin Dashboard** | Member stats, charts by dept/district, pending approvals queue |
| 🛡️ **Role System** | `superadmin`, `dept_admin`, `batch_admin`, `member` |
| ⏳ **Approval Workflow** | New registrations need admin approval before full access |
| 🌐 **Vercel-ready** | Single Next.js app deploys as one project on Vercel |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, React Server Components) |
| **Language** | TypeScript |
| **Database** | MongoDB Atlas (via Mongoose) |
| **Authentication** | Better Auth (v1.x) — session-based auth, no JWTs |
| **Styling** | Tailwind CSS v4 + shadcn/ui components |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Deployment** | Vercel (single repo, single project) |

---

## 📁 Project Structure

```
khulna-association/
├── app/                          ← Next.js App Router
│   ├── api/
│   │   ├── auth/[...all]/        ← Better Auth handler (sign in, sign up, sessions)
│   │   ├── members/              ← GET list, GET/:id, PATCH/:id
│   │   ├── admin/
│   │   │   ├── approvals/        ← GET pending, PATCH approve/reject
│   │   │   └── members/[id]/     ← PATCH role, DELETE member
│   │   ├── events/               ← CRUD + RSVP
│   │   ├── forum/                ← Posts + Comments
│   │   ├── committee/            ← Positions CRUD
│   │   ├── stats/                ← Dashboard analytics
│   │   ├── departments/          ← Reference data
│   │   └── districts/            ← Reference data
│   ├── page.tsx                  ← Home page
│   ├── login/page.tsx            ← Login
│   ├── register/page.tsx         ← Register
│   ├── dashboard/page.tsx        ← User dashboard
│   ├── directory/page.tsx        ← Member directory
│   ├── events/page.tsx           ← Events list
│   ├── forum/page.tsx            ← Forum
│   ├── committee/page.tsx        ← Committee
│   ├── profile/page.tsx          ← Edit profile
│   └── admin/
│       ├── approvals/page.tsx    ← Pending approvals queue
│       └── members/page.tsx      ← All members management
├── components/
│   ├── pages/                    ← Client-side page components
│   ├── ui/                       ← shadcn/ui components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ProtectedRoute.tsx
├── hooks/
│   └── use-session.ts            ← Auth session hook
├── lib/
│   ├── auth.ts                   ← Better Auth server config
│   ├── auth-client.ts            ← Better Auth client config
│   ├── mongodb.ts                ← Mongoose connection
│   ├── server-auth.ts            ← Server-side auth middleware helpers
│   ├── api.ts                    ← Client-side fetch wrapper
│   └── models/                   ← Mongoose schemas
│       ├── MemberProfile.ts      ← Extended user profile
│       ├── Event.ts
│       ├── EventAttendee.ts
│       ├── CommitteePosition.ts
│       ├── ForumPost.ts
│       ├── ForumComment.ts
│       ├── Department.ts
│       └── District.ts
├── scripts/
│   ├── seed.ts                   ← Seed departments + districts
│   └── make-admin.ts             ← Promote user to superadmin
├── .env.example                  ← Template (copy to .env.local)
├── .env.local                    ← Your actual secrets (git-ignored)
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🔧 Prerequisites

Before you begin, make sure you have:

- **Node.js 20+** — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **A MongoDB Atlas account** — [Free at mongodb.com](https://mongodb.com)
- **A Vercel account** (for deployment) — [Free at vercel.com](https://vercel.com)
- **Git** — [Download here](https://git-scm.com/)

---

## 🚀 Step-by-Step Setup Guide

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/khulna-association.git
cd khulna-association
```

Or if you downloaded the zip:
```bash
unzip khulna-association.zip
cd khulna-association
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

This installs all packages including Next.js, Better Auth, Mongoose, and all UI libraries.

---

### Step 3 — Set Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Open `.env.local` and set the following:

```env
# ─── MongoDB ─────────────────────────────────────────────────────────
# Your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0

# ─── Better Auth ─────────────────────────────────────────────────────
# A random secret (min 32 characters) — generate with:
#   openssl rand -base64 32
BETTER_AUTH_SECRET=your-random-secret-here

# The base URL of your app — use localhost for development
BETTER_AUTH_URL=http://localhost:3000

# Public URL (same as BETTER_AUTH_URL for development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### How to get your MongoDB URI:
1. Go to [mongodb.com](https://mongodb.com) → Log In → Create a free cluster
2. Click **Connect** → **Drivers** → Copy the connection string
3. Replace `<username>` and `<password>` with your credentials
4. Make sure your IP address is whitelisted in **Network Access**

#### How to generate a secure secret:
```bash
# On Mac / Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

---

### Step 4 — Seed Reference Data

This populates the database with Khulna Division's **10 districts** and **22 academic departments** so the registration form works properly:

```bash
npm run seed
```

Expected output:
```
✅ Connected to MongoDB
✅ Seeded 22 departments
✅ Seeded 10 Khulna districts
✅ Seeding complete! You can now start the app.
```

> **Note:** The seed script is safe to run multiple times — it uses `upsert` so it won't create duplicates.

---

### Step 5 — Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Khulna Association homepage.

---

### Step 6 — Register Your Account

1. Click **"Join Now"** or go to [http://localhost:3000/register](http://localhost:3000/register)
2. Fill in all required fields:
   - Full Name
   - Email (this will be your admin email)
   - Password (minimum 8 characters)
   - Mobile number
   - Department
   - District
   - Batch
   - Admission Session
3. Click **"Create Account"**
4. You will be redirected to the dashboard with a **"pending"** status — this is normal

---

### Step 7 — Generate the Admin Password (Create Superadmin)

This is the most important step. After registering, you need to promote your account to `superadmin` so you can approve other members and manage the association.

**While the dev server is running**, open a **second terminal** in the same project folder and run:

```bash
npm run make-admin -- your-email@example.com
```

Replace `your-email@example.com` with the email you registered with.

Example:
```bash
npm run make-admin -- admin@khulna-neu.org
```

Expected output:
```
✅ Connected to MongoDB
✅ User "Md. Rahim Uddin" is now a superadmin with status: approved
   They can now log in and access the admin panel.
```

> **What this does:** It directly updates your account in MongoDB to set `role: "superadmin"` and `status: "approved"`. You do NOT need to create a separate admin account — just register normally through the website, then run this script.

> **Security note:** This script can only be run by someone who has access to the server/deployment environment. Do not expose this script publicly.

---

### Step 8 — Access the Admin Panel

1. Go to your dashboard at [http://localhost:3000/dashboard](http://localhost:3000/dashboard) and **refresh the page**
2. You should now see the full admin dashboard with stats and charts
3. Click **"Manage Approvals"** or go to [http://localhost:3000/admin/approvals](http://localhost:3000/admin/approvals) to approve pending members
4. Go to [http://localhost:3000/admin/members](http://localhost:3000/admin/members) to manage all members and assign roles

> **Tip:** After approving yourself and others, all RSVP and forum posting features become available.

---

## 🚀 Deploying to Vercel

### One-Repo Setup (Recommended)

This is a **single Next.js repository** — it deploys as one project on Vercel (both frontend and backend API routes together).

**Step 1 — Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit: Khulna Association platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/khulna-association.git
git push -u origin main
```

> **Important:** Make sure `.env.local` is in your `.gitignore` (it already is by default). Never push your secrets to GitHub.

**Step 2 — Create a Vercel Project**

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository (`khulna-association`)
3. Vercel will auto-detect it as a Next.js project — click **Deploy** (don't click yet, set env vars first)

**Step 3 — Set Environment Variables on Vercel**

Before deploying, click **"Environment Variables"** and add:

| Name | Value | Notes |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://...` | Your full MongoDB Atlas connection string |
| `BETTER_AUTH_SECRET` | `your-32-char-secret` | The same secret from your `.env.local` |
| `BETTER_AUTH_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL (without trailing `/`) |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Same as `BETTER_AUTH_URL` |

> **Important:** After your first deploy, Vercel gives you a URL like `https://khulna-association-abc123.vercel.app`. Set a **custom domain** or use that URL for `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`. Then redeploy if you change these.

**Step 4 — Deploy**

Click **Deploy**. Vercel will build and deploy your app in ~2-3 minutes.

**Step 5 — Seed the Production Database**

After deploying, seed your production MongoDB database by running the seed script locally with the production `MONGODB_URI`:

```bash
# Temporarily set MONGODB_URI to your production connection string, then:
MONGODB_URI="mongodb+srv://..." npm run seed
```

Or you can add the production URI to your `.env.local` temporarily:
```bash
npm run seed
```

**Step 6 — Create the Production Superadmin**

Register through your live Vercel URL, then run:
```bash
MONGODB_URI="mongodb+srv://..." npm run make-admin -- your-email@example.com
```

---

### Environment Variables on Vercel

To update env vars after deployment:
1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add/edit variables
3. Go to **Deployments** → **Redeploy** the latest deployment for changes to take effect

---

## 🛡️ Role System

| Role | Permissions |
|---|---|
| `member` | View directory, RSVP events, post in forum, edit own profile |
| `batch_admin` | All member permissions + approve/reject members in their batch |
| `dept_admin` | All member permissions + approve/reject members in their department |
| `superadmin` | Full access — manage all members, assign roles, delete content |

### Approving a member as `superadmin`:
1. Go to `/admin/approvals` — all pending registrations appear here
2. Click **"Approve"** or **"Reject"** for each pending member
3. Approved members immediately gain full access

### Assigning roles:
1. Go to `/admin/members`
2. Find the member and use the **Role** dropdown to change their role
3. Changes are instant — no confirmation needed

---

## 📡 API Reference

All API routes are under `/api/`. Authentication uses **secure HTTP-only session cookies** managed by Better Auth.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/sign-up/email` | None | Register a new user |
| `POST` | `/api/auth/sign-in/email` | None | Log in |
| `POST` | `/api/auth/sign-out` | Session | Log out |
| `GET` | `/api/auth/get-session` | None | Get current session |

### Members

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/members` | None | List approved members (paginated, filterable) |
| `GET` | `/api/members/:id` | None | Get single member profile |
| `PATCH` | `/api/members/:id` | Session | Update own extended profile |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/approvals` | Admin | List pending registrations |
| `PATCH` | `/api/admin/approvals` | Admin | Approve or reject a registration |
| `PATCH` | `/api/admin/members/:id` | Superadmin | Update role or status |
| `DELETE` | `/api/admin/members/:id` | Superadmin | Delete a member |

### Events

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/events` | None | List events |
| `POST` | `/api/events` | Admin | Create event |
| `GET` | `/api/events/:id` | None | Get single event |
| `PATCH` | `/api/events/:id` | Admin | Update event |
| `DELETE` | `/api/events/:id` | Admin | Delete event |
| `POST` | `/api/events/:id/rsvp` | Approved member | Toggle RSVP |

### Forum

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/forum` | None | List posts |
| `POST` | `/api/forum` | Approved member | Create post |
| `GET` | `/api/forum/:id` | None | Get post + comments |
| `DELETE` | `/api/forum/:id` | Author or Admin | Delete post |
| `PATCH` | `/api/forum/:id` | Admin | Pin/unpin post |
| `POST` | `/api/forum/:id/comments` | Approved member | Add comment |

### Reference Data

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/departments` | List all departments |
| `GET` | `/api/districts` | List all Khulna districts |
| `GET` | `/api/stats` | Association statistics (for dashboard) |

---

## 🗄️ MongoDB Collections

Better Auth manages these automatically:
- **`user`** — All user accounts (core fields + custom: role, status, department, district, batch, mobile, etc.)
- **`session`** — Active sessions
- **`account`** — Auth provider links
- **`verification`** — Verification tokens

Mongoose manages these:
- **`memberprofiles`** — Extended profile (bio, job, skills, social links)
- **`events`** — Association events
**`eventattendees`** — RSVP records
- **`committeepositions`** — Committee membership records
- **`forumposts`** — Forum posts
- **`forumcomments`** — Forum comments
- **`departments`** — Academic departments (seeded)
- **`districts`** — Khulna districts (seeded)

---

## 🔧 Troubleshooting

### "Cannot connect to MongoDB"
- Check that your `MONGODB_URI` in `.env.local` is correct
- Whitelist your IP in MongoDB Atlas: **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (for development)
- Make sure the password in the URI doesn't contain `@` or `#` — URL-encode special characters

### "BETTER_AUTH_URL not set" error
- Make sure `.env.local` exists and has `BETTER_AUTH_URL=http://localhost:3000`
- Restart the dev server after changing env variables: `Ctrl+C` then `npm run dev`

### Register page has no departments/districts
- Run `npm run seed` to populate reference data

### "User not found" after running make-admin
- Make sure you registered first through the website (at `/register`)
- Use the exact email address you signed up with
- Check spelling — emails are case-sensitive

### Login works but redirects to /login again (Vercel)
- Set `BETTER_AUTH_URL` to your exact Vercel URL with `https://` (no trailing slash)
- Redeploy after changing environment variables

### Session not persisting on Vercel
- Make sure `BETTER_AUTH_SECRET` is the same value across all deployments
- Ensure `BETTER_AUTH_URL` matches your actual deployment URL exactly

### Admin panel shows "Insufficient permissions"
- Make sure you ran `npm run make-admin` with your email
- Refresh the page / sign out and sign back in to refresh your session

---

## 📝 Development Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production build locally |
| `npm run seed` | Seed departments and districts into MongoDB |
| `npm run make-admin -- email@example.com` | Promote a user to superadmin |

---

## 🏗️ Building for Production (Local Test)

```bash
npm run build
npm run start
```

Then open [http://localhost:3000](http://localhost:3000).

---

## 📦 What Was Removed vs. Original

| Original | Replaced With |
|---|---|
| PostgreSQL / Drizzle ORM | MongoDB + Mongoose |
| Supabase | MongoDB Atlas |
| Custom JWT (jsonwebtoken + bcryptjs) | Better Auth (session-based) |
| Express.js backend (separate process) | Next.js API routes (same app) |
| Monorepo (pnpm workspaces) | Single Next.js project |
| All test files | Removed |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to GitHub: `git push origin feature/my-feature`
5. Open a Pull Request

---

*Built for the Khulna Division community at Netrokona University.*
