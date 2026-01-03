# 🥣 KainTayo (Campus Edition)

> **Team:** Guteam
>
> **Stack:** MERN (MongoDB, Express, React Native Expo, Node.js)

**KainTayo** is a hyper-local "Visual Directory" designed for university students to find affordable meals. It solves the "Petsa de Peligro" (budget constraint) problem by filtering dining options by specific campus zones (e.g., Gate 1, Main Bldg) and features a "Shake-to-Decide" randomizer.

---

## 📱 Core Features

- **📍 Campus-Aware Directory:** Filters places by specific zones (Inside/Outside Campus, Gate 1, etc.).
- **💰 Budget-First UX:** A global slider that instantly filters places based on your wallet (e.g., "Under ₱75").
- **🎲 Shake Randomizer:** Can't decide? Shake your phone to pick a spot from a filtered pool or a custom "Group Decision" list.
- **🍱 Student Hacks:** Highlights "Half-Order" availability (½) and amenities like Wifi/Charging.
- **📝 Smart Contribution:** Students can request new places via an Autocomplete system to prevent duplicates.
- **🛡️ Moderation:** All submissions default to "Pending" state (Wizard of Oz moderation strategy).

---

## 🛠 Tech Stack

- **Frontend:** React Native (Expo SDK 50+), **Expo Router** (File-based routing), TypeScript.
- **Styling:** React Native StyleSheet OR NativeWind (Tailwind CSS).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (M0 Sandbox).
- **State Management:** React Context API (Auth, Filters).
- **Hardware:** Expo Sensors (Accelerometer for Shake).

---

## 🤝 Collaboration & Git Workflow

We follow a strict Git workflow to keep our codebase clean and stable.

### **Branching Strategy**

- **`main`**: 🛡️ **Protected**. Contains production-ready code ONLY. **NEVER push directly to main.**
- **`develop`**: 💻 **Default**. The main development branch. Always create feature branches from here.

### **How to Contribute (Feature Branch Workflow)**

1. **Sync with Develop:** Always pull the latest changes before starting.

    ```bash
    git checkout develop
    git pull origin develop
    ```

2. **Create a Branch:** Name it `feature/your-feature-name`.

    ```bash
    git checkout -b feature/login-page
    ```

3. **Work & Commit:** Make your changes and commit them.
4. **Push:** Push your branch to the repo.

    ```bash
    git push origin feature/login-page
    ```

5. **Open a Pull Request (PR):** Go to GitHub and open a PR to merge your branch into `develop`.
6. **Notify Team:** Let the team know your PR is ready for review! 🚀

### **Workspace Navigation**

You generally **do not** need to `cd` into `client/` or `server/` unless you are:

1. **Running the project** (e.g., `npm run dev`, `npx expo start`).
2. **Installing new dependencies** (e.g., `npm install <package>`).

For general coding, editing, and git operations, you can stay in the root `kaintayo-app/` directory.

---

## 🚀 Getting Started

Since this is a **Monorepo**, you must set up the Server (Backend) and Client (Frontend) separately.

### 1. Prerequisites

- Node.js (v18 or higher)
- Git
- **Expo Go** App installed on your physical phone (Android/iOS).

### 2. Clone the Repository

```bash
git clone <YOUR_REPO_LINK>
cd kaintayo-app
```

### 3. Setup the Backend (Server)

The backend runs on port `5000`.

```bash
# 1. Enter server folder
cd server

# 2. Install dependencies
npm install

# 3. Create environment variables
# Ask the dev for the MONGO_URI connection string
touch .env
```

**Content of `server/.env`:**

```text
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/kaintayo
JWT_SECRET=super_secret_key_123
```

**Run the Server:**

```bash
npm run dev
# Terminal should say: "Server running on port 5000"
# Keep this terminal open!
```

### 4. Setup the Frontend (Client)

Open a **new terminal window/tab**.

```bash
# 1. Enter client folder
cd client

# 2. Install dependencies
npm install

# 3. Run the App
npx expo start
```

- Scan the **QR code** with your phone.
- Alternatively, you can run the app on an Android emulator through **Android Studio** by pressing `a` in the terminal or selecting the emulator in Expo Dev Tools.

---

## ⚠️ How to Connect Phone to Localhost (Crucial!)

Your physical phone cannot access `http://localhost:5000`. You must use your computer's **Local IP Address**.

1. **Find your IP Address:**
    - **Windows:** Open CMD, run `ipconfig`. Look for **IPv4 Address** (e.g., `192.168.1.5`).
    - **Mac/Linux:** Open Terminal, run `ifconfig | grep "inet " | grep -v 127.0.0.1`.

2. **Update the API Config:**
    - Open `client/services/api.ts` (or `client/constants/Config.ts`).
    - Change the base URL:

    ```typescript
    // REPLACE localhost with your IP!
    const BASE_URL = "http://192.168.1.5:5000/api/v1";
    ```

3. **Check Wi-Fi:** Ensure your phone and computer are connected to the **exact same Wi-Fi network**.

---

## 📂 Project Structure

```text
kaintayo-app/
├── client/                 # React Native App (Expo Router)
│   ├── app/                # Screens & File-based Navigation
│   │   ├── (tabs)/         # Bottom Tab Screens (Directory, Shake, etc)
│   │   └── _layout.tsx     # Root Layout
│   ├── components/         # Reusable UI (PlaceCard, Slider)
│   ├── context/            # Global State (AuthContext)
│   ├── services/           # API Calls (Axios)
│   └── ...
├── server/                 # Express API
│   ├── models/             # Mongoose Schemas (Place, Meal, User)
│   ├── routes/             # API Endpoints
│   ├── controllers/        # Logic
│   └── ...
└── README.md               # You are here
```

---

## 👥 Authors

**Guteam**

- **[Name 1]**
- **[Name 2]**
- **[Name 3]**
