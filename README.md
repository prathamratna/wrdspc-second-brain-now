# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/aa5cb3fe-5d9f-45e1-afcb-146779e88a02

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/aa5cb3fe-5d9f-45e1-afcb-146779e88a02) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Rich Text Editor Features

This application features a modern, Notion-like rich text editor built with Tiptap, offering a range of functionalities:

- **Comprehensive Formatting Toolbar:** A fixed toolbar at the bottom of the editor provides easy access to:
    - Font family and size selection.
    - Heading levels (H1, H2, H3).
    - Bold, Italic, Underline, Strikethrough.
    - Font color.
    - Bulleted and Numbered lists.
    - Indentation.
    - Link creation and editing.
- **Slash Commands:** Type `/` in the editor to quickly access commands for inserting elements or applying formats.
- **Content Export & Sharing:**
    - **Export to PDF:** The "Export" button (Download icon) triggers your browser's print dialog, allowing you to "Save as PDF".
    - **Copy as HTML:** The "Share" button (Share icon) copies the content as HTML to your clipboard.
    - **Copy as Markdown:** The "Copy MD" button copies the content as Markdown to your clipboard.

## Local Development and Building

Beyond using Lovable, you can develop and build this application locally.

### Prerequisites

- Node.js (use nvm for easy version management: [nvm setup](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm (comes with Node.js)
- **For Mobile Development:**
    - Android Studio and Android SDK (for Android)
    - Xcode and CocoaPods (for iOS, on a macOS machine)

### Running the Web Application

1.  Clone the repository: `git clone <YOUR_GIT_URL>`
2.  Navigate to the project directory: `cd <YOUR_PROJECT_NAME>`
3.  Install dependencies: `npm install`
4.  Start the development server: `npm run dev` (This opens the app in your browser)

### Building the Desktop Application

The desktop application uses Electron.

1.  Ensure all dependencies are installed: `npm install`
2.  Build the web app assets: `npm run build`
3.  Package the application:
    - For an unpacked, testable version: `npm run build:desktop:dir`
    - For distributable installers: `npm run build:desktop`
4.  Packaged applications are typically found in the `electron/dist_electron/` directory.

### Building Mobile Applications

Mobile apps are built using Capacitor.

**Android:**

1.  Ensure web assets are built: `npm run build`
2.  Sync web assets with the Android project: `npx cap sync android`
3.  Open the Android project in Android Studio: `npx cap open android` (or open the `android/` directory manually).
4.  Build and run the app from Android Studio.

**iOS (requires macOS):**

1.  Ensure web assets are built: `npm run build`
2.  Sync web assets with the iOS project: `npx cap sync ios`
3.  Install CocoaPods dependencies: `cd ios/App && pod install && cd ../..` (or `npx cap open ios` might prompt for this if CocoaPods is installed).
4.  Open the iOS project in Xcode: `npx cap open ios` (or open the `.xcworkspace` file in the `ios/App/` directory manually).
5.  Build and run the app from Xcode.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui (If still relevant, otherwise remove or verify)
- Tailwind CSS
- **Tiptap** (for the rich text editor)
- **Capacitor** (for cross-platform mobile and desktop capabilities)
- **Electron** (for the desktop application wrapper)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/aa5cb3fe-5d9f-45e1-afcb-146779e88a02) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
