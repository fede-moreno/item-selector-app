# Items Selector with folders

This project implements an interactive item selector with folder structure using Angular v20 with Signals, TypeScript, and Tailwind CSS, based on the designs provided in Figma.

## Prerequisites
- Node.js v18 or higher
- This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.5. `npm install -g @angular/cli`)

## Technologies used
- TypeScript
- Angular Signals for state management
- Tailwind CSS for styling
- Standalone components
- RxJS for HTTP operations
- Jest & Spectator for Unit Testing
- Playwright for E2E Testing
- ESLint & Prettier for linting

## Considerations
- Added support for keyboard navigation, Space and Enter select the row and arrow keys work for expanding the folders
- Indenting can become a Directive
- E2E and UI tests with StoryBook, Playwright (installed), Cypress could test the UI and Accessibility
- Some unit tests were created with GenAI help because of the time constraint

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.
## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with [Jest](https://jestjs.io/), use the following command:

```bash
jest
```

## Running end-to-end tests

For end-to-end (e2e) testing with Playwright, run:

```bash
ng e2e
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
