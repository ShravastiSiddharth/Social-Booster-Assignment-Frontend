# Task Manager Frontend

A modern, responsive frontend for the Task Manager application built with **Next.js 14**, **Tailwind CSS**, and **Shadcn UI**.

<!-- Build Status: Updated workflow with Supabase env vars -->

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd task-manager-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables:**
   - Create a `.env.local` file in the root directory.
   - Add the necessary variables (refer to `.env.example` if available):
     ```env
     NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
     NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
     NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
     ```

### Running the App

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

## 🧪 How to Test

### 1. User Authentication
- **Flow**:
  1. Click "Sign Up" / "Login" on the landing page.
  2. Enter credentials (via Supabase Auth).
  3. Verify redirection to the Dashboard upon success.

### 2. Task Management (CRUD)
- **UI Flow**:
  1. **Create**: Click the "**+ New Task**" button on the Dashboard. Fill in the title, description, priority, and date. Submit.
  2. **Read**: The new task should immediately appear in your task list.
  3. **Update**: Click the "Edit" icon on a task card. Change the status to "Completed" or modify the description. Save.
  4. **Delete**: Click the "Delete" (trash) icon. Confirm the action. The task should disappear.

### 3. Analytics Dashboard
- **Path**: Navigate to `/dashboard` (default after login).
- **Verification**: Check the charts and summary cards at the top of the page. They should reflect accurate counts of your current tasks (e.g., "Total Tasks", "Completed", "Pending").

### 4. GitHub Reports (Third-Party Feature)
- **Path**: Navigate to `/git-report` via the sidebar or navigation menu.
- **Flow**:
  1. Enter a valid GitHub username (e.g., `facebook` or your own username).
  2. Click "**Get Report**".
  3. **Verify**: A list of repositories should load.
  4. **Commit Counts**: Badges on each repository card will asynchronously load to show your commit count for that repo.

---

## 🌍 Deployment

### Deployment Notes
- **Platform**: Vercel (Recommended for Next.js) or Netlify.
- **Build**: The project uses standard Next.js build scripts (`npm run build`).
- **Configuration**:
  - Add your `NEXT_PUBLIC_...` environment variables to the Vercel/Netlify dashboard.
  - Ensure the `NEXT_PUBLIC_API_URL` points to your deployed backend URL (HTTPS).

---

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI (Radix Primitives)
- **State/Data**: React Query / SWR / Context API
- **Icons**: Lucide React
