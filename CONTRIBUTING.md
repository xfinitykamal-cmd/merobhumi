# Contributing to Merobhumi

Thank you for considering contributing to Merobhumi! This document outlines the process for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please be courteous and respectful in your interactions.

## How to Contribute

1. **Reporting Bugs**: Open an issue describing the bug and how to reproduce it.
2. **Suggesting Features**: Open an issue describing your feature idea.
3. **Submitting Code**: Make a pull request with your code changes.
4. **Improving Documentation**: Help improve the documentation through pull requests.

## Development Process

### Setup Local Environment

1. Clone the repository
2. Install dependencies for each app:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   cd ../admin && npm install
   ```
3. Set up environment files:
   ```bash
   cp backend/.env.example backend/.env.local
   cp frontend/.env.example frontend/.env.local
   cp admin/.env.example admin/.env.local
   ```
4. Edit each `.env.local` with your credentials.

## Project Structure Quick Reference

| Directory | App | Description |
|---|---|---|
| `backend/` | Node.js + Express REST API | Main API Server |
| `frontend/` | React + TypeScript user site | Customer-facing Portal |
| `admin/` | React admin dashboard | Admin & Agent Panel |

## Questions?

Please reach out to the project maintainers directly for support.