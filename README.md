# 🩺 BodyLog - 3D Anatomy Tracking & Documentation

BodyLog is a sophisticated 3D visualization tool designed for tracking and documenting anatomical observations. It provides an interactive interface to place markers on a 3D humanoid model, allowing users to maintain a chronological history of notes, images, and progress for specific body locations.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

- **Interactive 3D Visualization**: Explore a high-fidelity humanoid model with smooth orbit controls.
- **Dual Model Support**: Seamlessly switch between male and female anatomical models.
- **Precision Marking**: Double-click anywhere on the model to place a new tracking point.
- **Chronological Timeline**: Each marker supports multiple entries, creating a historical timeline of observations.
- **Multimedia Documentation**: Attach descriptions and images to your entries for comprehensive tracking.
- **Smart Persistence**: Automatically remembers your preferred model and sidebar state using local storage.
- **Responsive Design**: A modern, dark-themed interface built with Tailwind CSS and Lucide icons.
- **Image Lightbox**: View attached documentation images in a full-screen, interactive gallery.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MaloLM/BodyLog.git
   cd BodyLog
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory (if required for specific features like AI integration):

   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Launch the development server**
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack

- **Frontend**: React 18
- **3D Engine**: Three.js with `@react-three/fiber` and `@react-three/drei`
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useMemo, useCallback)
- **Build Tool**: Vite

## 📖 Usage Guide

- **Navigation**: Use your mouse to rotate (left click), zoom (scroll), and pan (right click) the 3D model.
- **Adding a Marker**: Double-click on any part of the body to open the entry modal.
- **Viewing History**: Click on an existing marker to see its timeline in the sidebar.
- **Managing Entries**: Use the sidebar to add new entries to existing markers, edit descriptions, or delete points.
- **Switching Models**: Use the toggle in the top-left corner to switch between male and female anatomy.

## 📄 License

This project is licensed under the Apache 2.0 license - see the [LICENSE](LICENSE) file for details.

---

Developed with ❤️ for anatomical documentation.
