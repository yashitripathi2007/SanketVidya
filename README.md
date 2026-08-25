# 🤟 SanketVidya (સંકેતવિદ્યા)

> **Problem Statement ID:** SVH26012  
> **Theme:** Smart Education | **Category:** Software  
> **Target Audience:** Deaf & Mute students in Gujarati-medium schools, their teachers, and parents.

SanketVidya is a **Progressive Web App (PWA)** designed to help deaf/mute students in Gujarati-medium schools learn and practice Indian Sign Language (ISL) at home. The application covers core educational modules (alphabets, numbers, words, math, science), contains a real-time Gujarati text/speech-to-sign converter, and offers detailed progress tracking for teachers and parents.

---

## 🚀 How to Run Locally

Follow these simple steps to run the application on your local machine:

### 1. Prerequisites
Ensure you have the following installed:
*   **Node.js** (v18.x or higher recommended)
*   **npm** (v9.x or higher)

### 2. Installation
1.  Open your terminal or command prompt.
2.  Navigate to the repository root directory.
3.  Install dependencies:
    ```bash
    # Install dependencies from the root directory
    npm install --prefix sanket-vidya
    ```

### 3. Running the Development Server
You can launch the development server directly from the workspace root directory:
```bash
# Start the development server from the root directory
npm run dev
```

Alternatively, you can navigate into the subfolder and run it:
```bash
cd sanket-vidya
npm run dev
```

### 4. Access the Application
Once the server starts, open your web browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Demo Login Credentials

For testing and demonstration, pre-seeded accounts are provided. You can log in using these credentials or use the **Quick Login** buttons on the login page:

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `student@demo.com` | `demo123` | Accesses lessons, exercises, writing-pad practice, and converter |
| **Teacher** | `teacher@demo.com` | `demo123` | Accesses class roster and student progress report cards |
| **Parent** | `parent@demo.com` | `demo123` | Accesses progress report cards for linked students |

---

## 🛠️ Technical Details & Architecture

### 1. Technology Stack
*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) for server-rendered page loading and API routes.
*   **Core Logic:** [React 19](https://react.dev/) using modern Hooks (`useContext`, `useCallback`, `useEffect`).
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & Vanilla CSS for premium, fluid user interfaces.
*   **Localization (Multi-language):** `next-intl` supporting English, Gujarati, and Hindi.
*   **Speech-to-Text Input:** Native browser **Web Speech API** for hands-free audio converter input.
*   **Session & Data Mocking:** Optimized Client-side LocalStorage mechanism (`localStorage.js`) seeded with initial progress data to support zero-setup offline-ready demo runs.
*   **PWA Support:** Installable app capabilities via `public/manifest.json` and client-caching service worker (`public/sw.js`).

### 2. File Directory Structure

```
SanketVidya/
├── package.json                   # Root package.json (with script helpers)
├── README.md                      # Project documentation (this file)
├── SanketVidya_TechSpec.md        # Original Technical Specification
└── sanket-vidya/                  # Main Next.js Project Directory
    ├── messages/                  # Locale JSON dictionaries (en, gu, hi)
    ├── public/                    # Static assets, icons, manifest, and service worker (sw.js)
    ├── src/
    │   ├── app/                   # Next.js App Router Pages and API Routes
    │   │   ├── api/               # API endpoints (lessons, exercises, attempts, reportcard, convert)
    │   │   ├── converter/         # Sign-language text/speech-to-sign converter UI
    │   │   ├── dashboard/         # Dashboards for Students, Teachers, and Parents
    │   │   ├── exercise/          # Interactive quiz interfaces
    │   │   ├── learn/             # Learning lessons module
    │   │   ├── login/             # Login screen with quick-login buttons
    │   │   ├── globals.css        # Main stylesheet defining styling tokens and design colors
    │   │   └── page.js            # Landing page
    │   ├── components/            # Reusable UI components
    │   │   ├── WritingPad.js      # Canvas-based character tracing & writing pad
    │   │   ├── SignConverter.js   # Text/Speech converter component
    │   │   ├── ReportCard.js      # Progress rendering component
    │   │   └── VideoPlayer.js     # Responsive YouTube / HTML5 video player wrapper
    │   └── lib/                   # State providers & client helpers
    │       ├── authContext.js     # User session management and authentication flow
    │       ├── localeContext.js   # Language selection context
    │       ├── localStorage.js    # Local database emulation (users, exercises, attempts)
    │       └── mockData.js        # Seed lessons, exercises, classes, and vocabularies
```

### 3. Core Technical Workflows

#### 🔄 Gujarati Text/Speech-to-Sign Converter
1.  **Input:** User inputs Gujarati text by typing, or via voice through the **Web Speech API** (which translates Gujarati speech to text in real-time).
2.  **Normalization:** The input is sanitized and tokenized into distinct words.
3.  **Dictionary Lookup:** The tokenized words are matched against the local sign dictionary (`MOCK_SIGN_LIBRARY` / `signLibrary`).
4.  **Fallback Mechanism:** If a full word is not found in the dictionary, it fallback to spelling out the word letter-by-letter using the ISL alphabet database.
5.  **Sequential Playback:** Matching sign videos are fetched and played sequentially in the custom queued `VideoPlayer` component.

#### 📝 Interactive Writing Pad (Canvas)
*   Integrates a HTML5 Canvas component that tracks touch/mouse gestures.
*   Provides students with visual guidance to trace Gujarati letters and signs directly on their screen.
*   Enables local clearing and saving of character attempts.

#### 📊 Report Card & Analytics (Aggregation)
*   **Attempts API:** Records student answers in the local database.
*   **Progress Calculation:** Aggregates percentage scores module-by-module (Alphabets, Numbers, Words, Math, Science).
*   **Role-Based Dashboards:**
    *   **Students** see their own scores and progress bars.
    *   **Teachers** view Class analytics showing all student averages and activity.
    *   **Parents** view performance cards specifically for their linked kids.

---

## 🔒 Security & Scope Requirements
*   **Role-based Route Protection:** Redirects unauthorized users from dashboards they do not have permissions to access (e.g. students accessing teacher logs).
*   **Local Execution:** Fully optimized to run locally via `npm run dev` with zero databases to set up.
