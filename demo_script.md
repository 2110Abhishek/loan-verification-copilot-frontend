# 🎬 5-Minute Product Demo & Pitch Video Script

**Project Title**: Loan Data Verification Copilot  
**Track**: Intain Campus FinTech Challenge 2026 — Full Stack Track  
**Target Duration**: 4:30 – 5:00 Minutes  
**Live Frontend**: https://loan-verification-copilot-gamma.vercel.app  
**Live Backend API**: https://loan-verification-copilot-backend.onrender.com  

---

## ⏱️ Video Script Breakdown

### 📍 Scene 1: Introduction & Problem Statement (0:00 – 0:45)
**Visual**: Show project landing screen on browser at `https://loan-verification-copilot-gamma.vercel.app`. Hover over the header showing *Loan Verification Copilot* and *Quality Score Gauge*.

**Voiceover**:
> *"Hello judges! Welcome to **Loan Verification Copilot** — an AI-assisted full-stack console engineered for the Intain Campus FinTech Challenge 2026.*
> 
> *Financial institutions process thousands of loan records daily. However, incoming loan tapes rarely arrive clean. They contain missing IDs, negative balances, inverted maturity dates, conflicting servicer updates, and formatting anomalies.*
> 
> *Our solution provides an enterprise verification layer that turns unstandardized loan tapes into validated, traceable, and trusted financial records backed by cryptographic SHA-256 hashes and an immutable audit trail. Let’s walk through the end-to-end workflow across our three core user personas."*

---

### 📍 Scene 2: Data Operator Persona — Ingestion & Normalization (0:45 – 1:30)
**Visual**: Select **Data Operator** from the persona switcher top-right. Click **Choose CSV File**, select `loan_tape.csv` (1,200 records), and click **Ingest & Validate Tape**.

**Voiceover**:
> *"We begin as **Alex Mercer, Data Operator**. In **Module A**, we drag and drop our primary dataset, `loan_tape.csv`.*
> 
> *Behind the scenes, our FastAPI ingestion engine standardizes messy currency formatting — converting text like `₹87,00,000` into canonical float values — normalizes ISO dates to `YYYY-MM-DD`, and preserves raw row lineage.*
> 
> *Upon completion, our summary cards update instantaneously: 1,200 records ingested, 910 passed validation, and 290 failed records flagged with 296 data quality exceptions. Notice how our system Data Quality Score immediately calculates at **76.4%**."*

---

### 📍 Scene 3: Reviewer Persona — Exception Queue & Bulk Actions (1:30 – 2:30)
**Visual**: Switch persona to **Reviewer**. Show the interactive **Exception Queue** table. Filter by `HIGH` severity. Click multi-select checkboxes to demonstrate the floating **Bulk Actions Toolbar**. Then click on loan `LN-00103` (`MATURITY_BEFORE_ORIGINATION`).

**Voiceover**:
> *"Next, we switch to **Sarah Chen, Senior Reviewer**. In **Module B & C**, Sarah enters the **Exception Queue**.*
> 
> *Our engine evaluates records against 16 configurable validation rules — covering interest rate boundaries, payment status vs. DPD mismatches, stale records, duplicate borrower combos, and invalid state codes.*
> 
> *Reviewers can search by Loan ID, filter by severity, or use our batch select-all feature to approve, reject, or delete exceptions in bulk.*
> 
> *Let's click on loan record **LN-00103**, flagged with a `HIGH` severity error: **Maturity Date Before Origination Date**."*

---

### 📍 Scene 4: AI Review Assistant & Human Safety Controls (2:30 – 3:30)
**Visual**: The **AI Copilot Reviewer Drawer** opens on the right. Click **Ask AI Copilot**. Show AI explanation, confidence score (`98.0%`), execution time (`120ms`), model badge (`Intain-Copilot-LLM/v2.4-local`), and suggested correction (`maturity_date -> 2055-01-15`). Click **Accept AI Suggestion & Approve**.

**Voiceover**:
> *"This opens **Module D — AI Review Assistant**. Clicking **Ask AI Copilot** triggers our dual-mode AI engine.*
> 
> *The AI analyzes the exception, cross-references multi-source data from `servicer_update.csv`, and generates a root-cause explanation: **'The maturity date (2055-01-15) precedes origination date (2025-01-15) due to a miskeyed origination term.'***
> 
> *In compliance with **Section 9 AI Controls**, the AI suggestion is presented separately with full metadata: model name, 98% confidence score, and 120ms latency. **The AI never silently alters data.** Sarah clicks **Accept AI Suggestion & Approve** to lock the human-verified record."*

---

### 📍 Scene 5: Data Consumer Persona — SHA-256 Hashes & Audit Trail (3:30 – 4:15)
**Visual**: Switch persona to **Data Consumer**. Show **Verified Loan Master Ledger** with green SHA-256 badges. Click on a record to view the **Audit Lineage Timeline** on the right. Click **Export Verified CSV** and **Export Audit Trail JSON** to demonstrate file downloads.

**Voiceover**:
> *"Now we log in as **Marcus Vance, Data Consumer**. In **Module E & F**, Marcus accesses trusted, canonical loan data.*
> 
> *Every approved loan is sealed with a cryptographic **SHA-256 record hash** computed over the payload, timestamp, and reviewer ID, guaranteeing tamper-proof data integrity.*
> 
> *On the right, our **Audit Lineage Timeline** logs every system action — from CSV upload to AI generation, reviewer edits, and verification.*
> 
> *Data consumers can click **Export Verified CSV** or **Export Audit Trail JSON** to download signed deliverables instantly."*

---

### 📍 Scene 6: Agentic Coding, Architecture & Conclusion (4:15 – 5:00)
**Visual**: Briefly display `architecture_note.md`, `ai_development_log.md`, and the live FastAPI Swagger docs at `/docs`.

**Voiceover**:
> *"Finally, in alignment with **Section 10 Agentic Coding Requirements**, our system was built using AI-assisted pair programming. Our **AI Development Log** documents representative prompts, human review checkpoints, and examples of rejected AI code outputs.*
> 
> *Our full application is deployed live with a **React 18 + Vite frontend on Vercel** and a **FastAPI + SQLite backend on Render**, featuring 9 complete REST endpoints documented via Swagger UI.*
> 
> *Thank you for reviewing **Loan Data Verification Copilot**!"*

---

## 💡 Video Recording Instructions & Setup

1. **Resolution**: 1920x1080 (1080p Full HD).
2. **Audio**: Use clear microphone audio with noise cancellation.
3. **Screen Tool**: Use OBS Studio, Loom, or Windows Game Bar (`Win + Alt + R`).
4. **Duration**: Keep total duration strictly between **4:30 and 5:00 minutes**.
