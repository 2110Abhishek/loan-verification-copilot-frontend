# Loan Data Verification Copilot — Frontend Console

Modern React 18 + TypeScript + Vite + Tailwind CSS dark-mode console for loan verification, exception review, and audit tracking.

## Local Setup & Execution

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```
*Access frontend at `http://localhost:5173`*

## Separate Deployment Instructions

### Deploy on Vercel
1. Push this repository to GitHub.
2. Log into [Vercel.com](https://vercel.com) and click **Add New Project**.
3. Select your `loan-verification-copilot-frontend` repository.
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://your-deployed-backend-url.onrender.com`
5. Click **Deploy**.

### Deploy on Netlify
1. Connect repository on Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable `VITE_API_BASE_URL` with your backend URL.
