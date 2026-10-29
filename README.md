# Bakeoff 2 – Astro Loan Application Prototype

## Overview

This project is the second technology bakeoff for WDD 430. The goal of this bakeoff is to explore a static-first architecture using Astro while still supporting the dynamic features required for a working full-stack prototype.

The application is a simple loan application workflow with two user roles:

- Loan Officer
- Credit Manager

Loan Officers can create and manage loan applications, submit them for review, and view credit decisions. Credit Managers can review submitted applications and update their status.

## Technology Stack

- Astro
- Node.js
- MongoDB
- MongoDB Node Driver
- bcrypt
- Astro Node Adapter
- HTML
- CSS
- JavaScript

## Architecture

Astro is used as a static-first framework with selected routes rendered on demand.

Most pages are built with `.astro` files and Astro's file-based routing system. Dynamic pages and routes that require cookies, authentication, form processing, or database access use:

```js
export const prerender = false;
```

This allows the project to remain static-first while supporting server-side functionality where needed.

## Core Features

### Authentication

- User signup
- Password hashing with bcrypt
- User login
- Cookie-based authentication
- Role-based redirects
- Loan Officer and Credit Manager roles
- Logout support
- Protected pages based on authentication and role

### Loan Officer

Loan Officers can:

- Create loan applications
- View their applications
- Open applications in underwriting
- Submit pending applications for Credit Manager review
- View updated application decisions
- Delete completed or unwanted applications

### Credit Manager

Credit Managers can:

- View applications submitted for review
- Open applications in underwriting
- Review borrower and loan information
- Approve applications
- Counter applications
- Deny applications
- Keep applications in review

## Application Status Flow

```text
pending
   ↓
in_review
   ↓
approved / countered / denied
```

A new application begins with a `pending` status.

The Loan Officer submits the application for review, changing the status to `in_review`.

The Credit Manager can then update the status to:

- `approved`
- `countered`
- `denied`
- `in_review`

## Loan Application Fields

Each application contains:

- First Name
- Last Name
- Loan Request
- Purpose
- Monthly Income
- Monthly Debt
- Credit Score
- Debt-to-Income Ratio
- Status
- Loan Officer User ID
- Created Date
- Updated Date

Loan purpose options include:

- Purchase
- Debt Consolidation
- Refinance

## Debt-to-Income Ratio

DTI is calculated using:

```text
Monthly Debt / Monthly Income × 100
```

The calculated DTI is stored with the application and displayed on the underwriting page.

## Project Structure

```text
src/
├── components/
│   └── Navbar.astro
│
├── layouts/
│   └── Layout.astro
│
├── lib/
│   └── mongodb.js
│
└── pages/
    ├── api/
    │   ├── applications.js
    │   ├── login.js
    │   ├── logout.js
    │   ├── signup.js
    │   └── test-db.js
    │
    ├── applications/
    │   └── create.astro
    │
    ├── dashboard/
    │   ├── cm.astro
    │   └── lo.astro
    │
    ├── underwriting/
    │   └── [id].astro
    │
    ├── login.astro
    └── signup.astro
```

## Routing

Astro uses file-based routing.

Examples:

```text
src/pages/login.astro
→ /login

src/pages/signup.astro
→ /signup

src/pages/dashboard/lo.astro
→ /dashboard/lo

src/pages/dashboard/cm.astro
→ /dashboard/cm

src/pages/applications/create.astro
→ /applications/create

src/pages/underwriting/[id].astro
→ /underwriting/:id

src/pages/api/login.js
→ /api/login
```

## MongoDB

The project uses MongoDB for persistence.

The main collections are:

```text
users
applications
```

### User Document Example

```js
{
  email: "user@example.com",
  passwordHash: "...",
  role: "loan_officer",
  createdAt: new Date()
}
```

### Application Document Example

```js
{
  userId: ObjectId("..."),
  firstName: "John",
  lastName: "Doe",
  loanRequest: 25000,
  purpose: "purchase",
  monthlyIncome: 6000,
  monthlyDebt: 1800,
  creditScore: 720,
  dti: 30,
  status: "pending",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

## Environment Variables

Create a `.env` file in the project root.

```env
MONGODB_URI=your_mongodb_connection_string
```

Do not commit the `.env` file or database credentials to GitHub.

## Installation

Install project dependencies:

```bash
npm install
```

If needed, install the required packages:

```bash
npm install mongodb bcrypt
npx astro add node
```

## Run the Project

Start the development server:

```bash
npm run dev
```

Astro will normally run locally at:

```text
http://localhost:4321
```

## Testing Workflow

A complete application workflow should work as follows:

```text
Loan Officer Login
        ↓
Create Application
        ↓
Save to MongoDB
        ↓
Open Underwriting
        ↓
Submit for Review
        ↓
Status = in_review
        ↓
Credit Manager Login
        ↓
View Application
        ↓
Open Underwriting
        ↓
Approve / Counter / Deny
        ↓
Loan Officer Dashboard
        ↓
View Updated Status
```

## Responsive Design

The application includes responsive layouts for desktop and mobile.

Dashboard application rows collapse into a stacked layout on smaller screens, while forms and underwriting controls adjust to fit mobile displays.

## Validation and Error Handling

The prototype includes basic validation for:

- Required fields
- Email and password
- Duplicate email accounts
- Minimum password length
- Loan amount
- Monthly income
- Monthly debt
- Credit score range
- Loan purpose
- Authentication
- User roles
- MongoDB ObjectIds

## Bakeoff Goal

The primary goal of this project is to compare Astro's static-first architecture with the hybrid SvelteKit architecture used in Bakeoff 1.

Astro provides file-based routing and static rendering by default while allowing selected routes to use on-demand server rendering. This makes it possible to keep most of the application static while still supporting authentication, cookies, MongoDB, and dynamic form processing.

## Testing Credentials

### Loan Officer

Loan Officers can create their own account using the Sign Up page.

After creating an account, they can:

- Log in
- Create loan applications
- View their applications
- Submit applications for Credit Manager review
- View updated application statuses

### Credit Manager

When applications are ready for review, use the following Credit Manager test account:

**Email:** `creditmanager@byui.com`  
**Password:** `test1234`

The Credit Manager can:

- View applications submitted for review
- Open underwriting details
- Approve applications
- Counter applications
- Deny applications
- Keep applications in review

## Author

Bryson Webb  
WDD 430 – Web Full-Stack Development
