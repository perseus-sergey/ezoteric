# EZOTERIC

An AI-powered bilingual platform combining esoteric content, interactive tests, specialist booking and AI chat.

The project was built as a full-stack Next.js application with PostgreSQL, authentication, AI integrations and an administration panel.

## Features

- Bilingual user interface and content
- AI-powered chat
- Persistent chat history for authenticated users
- Anonymous chat sessions stored locally
- AI-generated articles
- AI-generated interactive tests
- Administration panel for managing content and AI generation
- Google OAuth authentication
- User authentication and authorization
- Specialist appointment scheduling
- Email notifications
- PostgreSQL database
- Responsive interface
- SEO-friendly content structure

## AI Integration

AI is used as an integral part of the application rather than only as a standalone chat feature.

The platform includes:

- AI-powered conversational chat
- AI-generated articles
- AI-generated tests and questions
- Dynamic content generation from the administration panel
- Persistent storage of generated content in PostgreSQL

The application was designed so that AI-generated content could be created and managed through the admin interface rather than being hardcoded into the application.

## Authentication & User Data

The application supports both authenticated and anonymous user flows.

### Authenticated users

- Google OAuth
- Persistent chat history
- User-specific data stored in PostgreSQL
- Protected application functionality

### Anonymous users

- Chat sessions maintained in local storage
- No account required to use the basic AI chat functionality

Administrative functionality is protected separately from the public application.

## Booking & Email

The platform includes specialist appointment scheduling with email notifications.

The booking flow includes:

1. Selecting a specialist
2. Selecting an available time
3. Creating the appointment
4. Persisting booking data in PostgreSQL
5. Sending notification emails

Email templates are generated programmatically and used for application notifications.

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Responsive UI
- React Hook Form
- Zod

### Backend

- Next.js
- Node.js
- REST/API integrations
- Server-side application logic
- Authentication and authorization

### Database

- PostgreSQL
- Drizzle ORM

### Authentication

- Google OAuth
- Auth.js / NextAuth
- Protected routes and admin functionality

### AI

- Google Gemini
- AI SDK

### Email

- React Email
- Nodemailer / email integrations

### Development

- Git
- GitHub
- ESLint
- Prettier
- Jest
- React Testing Library

## Architecture

The application is built around a full-stack Next.js architecture.

```text
Browser
   │
   ▼
Next.js / React
   │
   ├── Server-side application logic
   ├── Authentication
   ├── AI integrations
   ├── Booking
   └── Email notifications
   │
   ▼
Drizzle ORM
   │
   ▼
PostgreSQL
```

AI services and Google OAuth are integrated through server-side application logic, while user-facing functionality is implemented with React and Next.js.

## Project Structure

The application separates public functionality, authenticated user functionality and administration features.

```text
Public
 ├── Content
 ├── Tests
 └── AI Chat

Authenticated
 ├── User account
 └── Chat history

Administration
 ├── Content management
 ├── AI content generation
 ├── Tests management
 └── User / application management
```

## Development

The project was developed as an end-to-end full-stack application, including:

- Application architecture
- UI implementation
- Database design
- API and server-side logic
- Authentication
- AI integrations
- Booking workflow
- Email notifications
- Administration tools
- Deployment and maintenance

## Author

**Sergiy Gubriy**

Full-Stack Developer
JavaScript / TypeScript · React · Next.js · Node.js · PostgreSQL

pnpm build

> ezoteric@0.1.0 build /sait/NextJs/ezoteric
> next build

▲ Next.js 15.5.26

- Environments: .env.local

Creating an optimized production build ...
✓ Compiled successfully in 6.9s
Linting and checking validity of types .Failed to compile.

Type error: Type 'typeof import("/sait/NextJs/ezoteric/app/[lang]/layout")' does not satisfy the constraint 'LayoutConfig<"/[lang]">'.
Types of property 'default' are incompatible.
Type '({ children, params }: Readonly<{ children: ReactNode; params: TParams; }>) => Promise<Element>' is not assignable to type 'ComponentType<LayoutProps<"/[lang]">> | ((props: LayoutProps<"/[lang]">) => void | ReactNode | Promise<void> | Promise<...>)'.
Type '({ children, params }: Readonly<{ children: ReactNode; params: TParams; }>) => Promise<Element>' is not assignable to type 'FunctionComponent<LayoutProps<"/[lang]">>'.
Types of parameters '\_\_0' and 'props' are incompatible.
Type 'LayoutProps<"/[lang]">' is not assignable to type 'Readonly<{ children: ReactNode; params: TParams; }>'.
Types of property 'params' are incompatible.
Type 'Promise<{ lang: string; }>' is not assignable to type 'TParams'.
Type '{ lang: string; }' is missing the following properties from type '{ id: string; page: string; "page-id": string; "page-test-id": string; "page-test-cat-id": string; category: string; categories: string; lang: string; slug: string; "tag-slug": string; master: string; schedule: string; ... 12 more ...; tags: string; }': id, page, "page-id", "page-test-id", and 20 more.

Next.js build worker exited with code: 1 and signal: null
 ELIFECYCLE  Command failed with exit code 1.
