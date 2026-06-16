# Personal Project Sandbox

Welcome to the Personal Project Sandbox, a browser-based web application designed for creative individuals and hobbyists to capture, organize, and track their personal project ideas and tasks without the overhead of professional project management tools.

## Problem Solved
Creative minds often juggle numerous small project ideas or informal tasks that don't fit into rigid management systems. This application provides a simple, visual, and flexible solution to manage these endeavors.

## Solution Overview
This web application allows users to:

*   **Create Project Boards:** Set up distinct boards for different projects or areas of interest.
*   **Configurable Columns:** Each board can have customizable columns (e.g., "Ideas," "Doing," "Done") to represent stages of progress.
*   **Task Cards:** Add cards for individual tasks or concepts within any column.
*   **Flexible Movement:** Cards can be freely moved between columns, edited, and marked complete.
*   **Local Storage Persistence:** All data is stored directly in the user's browser using local storage, ensuring privacy and no dependency on external databases or APIs.
*   **Archives:** A dedicated section to view and manage completed or archived cards.

## Features

*   **Dashboard:** View all your project boards, create new ones, and navigate to specific boards.
*   **Project Board:** A dynamic interface to manage columns and cards. Add, edit, move, and archive cards with ease.
*   **Archives:** A place to revisit previously completed or archived tasks.
*   **Stunning UI:** Features a dark theme with vibrant gradient accents, glassmorphic cards, and smooth transitions for a delightful user experience.

## Technologies Used

*   Next.js 14 (App Router)
*   React 18
*   Pure CSS for styling (no Tailwind, no CSS modules)
*   Browser Local Storage for data persistence

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository (or create the files from the JSON output):**
    ```bash
    git clone <repository-url> # If applicable
    cd project-sandbox
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

4.  **Build for production:**
    ```bash
    npm run build
    ```

5.  **Start the production server:**
    ```bash
    npm run start
    ```

    The application will be available on [http://localhost:3000](http://localhost:3000) (or the specified port).

## Data Persistence
All project data (boards, columns, cards, archives) is saved directly in your browser's Local Storage. This means your data is private to your browser and will persist across sessions, but it will not sync across different devices or browsers.

Enjoy organizing your creative chaos!
