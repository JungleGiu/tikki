# 🎫 Tikkin

> Modern ticket management system built with Angular 20 for streamlined team collaboration and project tracking.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://tikki-beige.vercel.app/)
[![Angular](https://img.shields.io/badge/Angular-18-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

**[Live Demo](https://tikki-beige.vercel.app/)** | **[Report Bug](https://github.com/JungleGiu/tikki/issues)** | **[Request Feature](https://github.com/JungleGiu/tikki/issues)**

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About

**Tikkin** is a comprehensive ticket management application designed to help teams organize, track, and resolve issues efficiently. Built with Angular 18 and powered by Supabase, it provides a real-time collaborative environment with role-based access control, interactive Kanban boards, and integrated chat functionality.

### Why Tikkin?

- **Real-time Collaboration**: Live updates across all team members with WebSocket integration
- **Intuitive Interface**: Drag-and-drop Kanban boards and clean, modern UI
- **Secure**: Role-based access control (RBAC) with Supabase authentication
- **Scalable**: Modular architecture following Angular best practices
- **Production-Ready**: Built with enterprise-grade tools and deployment pipeline

---

## ✨ Features

### Core Functionality

- 🎫 **Ticket Management**
  - Create, edit, update, and delete tickets
  - Assign tickets to team members
  - Filter and search tickets
  - Set priority levels and status tracking
  - Add labels, tags, and categories

- 📊 **Kanban Board**
  - Drag-and-drop ticket cards between columns
  - Real-time board updates across users
  - Customizable board columns and workflows
  - Filter and search capabilities

- 💬 **Real-time Chat**
  - Ticket-specific discussion threads
  - Team collaboration channels
  - Live message notifications
  - File sharing support

- 👥 **Team Management**
  - User roles and permissions (Company, Head of Department, Team Member)
  - Team member assignment
  - Activity tracking and audit logs

### Additional Features

- 📈 **Dashboards & Analytics**
  - Visual ticket statistics
  - Team performance metrics
  - Custom reports and charts

- 🔍 **Advanced Search & Filters**
  - Full-text search across tickets
  - Multi-criteria filtering
  - Saved search queries

- 🔔 **Notifications**
  - Real-time in-app notifications
  - Email notifications (configurable)
  - Activity feed

- 📱 **Responsive Design**
  - Tablet and desktop interface
  - Tablet optimization
  - Desktop-first responsive breakpoints

- 🔐 **Security**
  - Role-based access control (RBAC)
  - Row-level security (RLS) with Supabase
  - Secure authentication flow
  - Session management

---

## 🛠️ Tech Stack

### Frontend
- **[Angular 18](https://angular.io/)** - Progressive web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Typed superset of JavaScript
- **[RxJS](https://rxjs.dev/)** - Reactive programming library
- **[Angular Material](https://material.angular.io/)** / **[Tailwind CSS](https://tailwindcss.com/)** - UI components and styling
- **[SCSS](https://sass-lang.com/)** - CSS preprocessor

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication & authorization
  - Edge functions
  - Row Level Security (RLS)

### DevOps & Tools
- **[Angular CLI](https://cli.angular.io/)** - Command line interface
- **[Jasmine](https://jasmine.github.io/)** & **[Karma](https://karma-runner.github.io/)** - Testing framework
- **[Git](https://git-scm.com/)** - Version control
- **[pnpm](https://pnpm.io/)**  - Package manager

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher) or **pnpm** / **yarn**
- **Angular CLI** (v20)
  ```bash
  npm install -g @angular/cli@20
  ```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JungleGiu/tikki.git
   cd tikki
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory (or use Angular's `environment.ts`):

   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key

   # Optional: Email Configuration
   EMAIL_SERVICE_API_KEY=your_email_service_key
   ```

   **Note:** Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase project details.
    Or ask me for the keys if you don't have them yet.


4. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:4200/`

---

## 📁 Project Structure

```
tikkin/
├── src/
│   ├── app/
│   │   ├── core/                 # Singleton services, guards, models
│   │   │   ├── guards/           # Route guards (auth, role-based)
│   │   │   ├── models/           # TypeScript interfaces & types
│   │   │   └── services/         # Core services (auth, API, state)
│   │   │
│   │   ├── features/             # Feature modules (lazy-loaded)
│   │   │   ├── auth/             # Authentication (login, register)
│   │   │   ├── chat/             # Real-time chat functionality
│   │   │   ├── dashboards/       # Analytics & overview dashboards
│   │   │   ├── kanban/           # Kanban board with drag-and-drop
│   │   │   ├── landing/          # Public landing page
│   │   │   ├── teams/            # Team management
│   │   │   ├── tickets/          # Ticket CRUD operations
│   │   │   └── tools/            # Utility tools & settings
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── auth-layout/      # Layout for auth pages
│   │   │   └── public-layout/    # Layout for public pages
│   │   │
│   │   └── shared/               # Shared resources
│   │       ├── components/       # Reusable UI components
│   │       ├── pipes/            # Custom Angular pipes
│   │       └── utils/            # Helper functions & utilities
│   │
│   ├── assets/                   # Static assets (images, fonts)
│   ├── environments/             # Environment configurations
│   └── styles/                   # Global styles & theme
│
├── .angular/                     # Angular cache
├── .vscode/                      # VS Code settings
├── node_modules/                 # Dependencies
├── dist/                         # Build output
│
├── angular.json                  # Angular CLI configuration
├── package.json                  # NPM dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── karma.conf.js                 # Karma test runner config
└── README.md                     # You are here!
```

---

## 💡 Usage

### Creating Your First Ticket

1. **Log in** to your account or **register** a new one
2. Navigate to the **Tickets** page
3. Click **"New Ticket"**
4. Fill in the ticket details:
   - Title
   - Description
   - Priority (Low, Medium, High, Critical)
   - Assignee
   - Labels/Tags
5. Click **"Create"**

Note: When you register a new account, you'll be automatically assigned the **Company** role, you can then add other team members as **Managers** or **Members**. The users will be notified via email when you create their account and will be invited to join the team and start collaborating .

### Using the Kanban Board

1. Go to the **Kanban** view
2. Drag tickets between columns:
   - **Backlog** → **To Do** → **In Progress** → **Review** → **Done**
3. Click on a ticket card to view/edit details
4. Use filters to focus on specific tickets

### Team Collaboration

1. Navigate to **Teams**
2. Invite team members via email
3. Assign roles (Admin, Manager, Member)
4. Create team-specific boards and ticket queues

---

## 🧪 Testing

### Running Unit Tests

```bash
npm test
# or
ng test
```

---

## 🌐 Deployment

Tikkin is deployed on **Vercel** with automatic deployments from the `main` branch.

---

## 🗺️ Roadmap

- [x] Core ticket management (CRUD)
- [x] Kanban board with drag-and-drop
- [x] Real-time chat functionality
- [x] User authentication & RBAC
- [x] Responsive design
- [ ] Email notifications
- [ ] File attachments to tickets
- [ ] Advanced analytics dashboard
- [ ] Time tracking
- [ ] Sprint planning features
- [ ] Mobile app (React Native)
- [ ] Integrations (Slack, GitHub, Jira)

See the [open issues](https://github.com/JungleGiu/tikki/issues) for a full list of proposed features and known issues.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Coding Standards

- Follow the [Angular Style Guide](https://angular.io/guide/styleguide)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Run `npm run lint` before committing

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` file for more information.

---

## 👤 Contact

**Giú Eminente** - Frontend Developer

- 🌐 Portfolio: [giueminente.pw](https://giueminente.pw)
- 💼 LinkedIn: [linkedin.com/in/giueminente](https://linkedin.com/in/giueminente)
- 🐙 GitHub: [github.com/JungleGiu](https://github.com/JungleGiu)
- 📧 Email: giueminentedev@gmail.com


**Live Demo**: [https://tikki-beige.vercel.app/](https://tikki-beige.vercel.app/)

---

## 🙏 Acknowledgments

This project was developed as part of the **IT Academy - Barcelona Activa** Frontend Development Bootcamp (Angular specialization).

- [Angular Documentation](https://angular.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular Material](https://material.angular.io/)
- [Vercel](https://vercel.com/)

---

<p align="center">Made with ❤️ by Giú Eminente</p>
<p align="center">⭐ Star this repo if you found it helpful!</p>