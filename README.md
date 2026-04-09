# 🎮 GameTrack

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://BastianLazo.github.io/gametrack)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-yellow)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-red)](LICENSE)

> A personal game wishlist and backlog manager with real-time price tracking, statistics dashboard, and dark mode.

**Live Demo:** [https://BastianLazo.github.io/gametrack](https://BastianLazo.github.io/gametrack)

---

## 📋 Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Game Search** | Search thousands of games using RAWG API |
| 💖 **Wishlist** | Save games you want to buy later |
| 📋 **Backlog** | Track games you're playing with status updates |
| 🏷️ **Price Tracking** | Real-time deals from CheapShark API |
| 📊 **Statistics** | Visual charts of your gaming progress |
| 🎲 **Random Picker** | Let the app choose your next game |
| 🌙 **Dark Mode** | Toggle between light and dark themes |
| 💾 **Local Storage** | Data persistence without backend |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

### Backlog Status Flow


---

## 🛠️ Technologies

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Recharts** - Charting library
- **Context API** - State management (dark mode)

### APIs
- **RAWG API** - Game database and search
- **CheapShark API** - Real-time game deals and prices

### Deployment
- **GitHub Pages** - Free hosting

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps

```bash
# Clone the repository
git clone https://github.com/BastianLazo/gametrack.git

# Navigate to project
cd gametrack

# Install dependencies
npm install

# Create environment file
echo "VITE_RAWG_API_KEY=your_api_key_here" > .env

# Start development server
npm run dev