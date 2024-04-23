# Frontend

## Requirements

* [Node Js v20.x.x](https://nodejs.org/en/download)
* [Yarn v4.xx](https://yarnpkg.com/getting-started/install)

## Getting Started

### Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Configure environment variables

Create an `.env.local` file or make a copy of `.env.example`. Change the variable values as needed.

### Run locally

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [https://localhost:3001](https://localhost:3001) with your browser to see the result.

To change the port on which the project is launched, change the corresponding parameter in the project launch command [here](/frontend/package.json#L6).

### Version Upgrade
To update the version of the project, it is enough to run the following command:

```
npm version <major|minor|patch>
```
For more information about this command, you can visit the documentation page https://docs.npmjs.com/cli/v8/commands/npm-version

## Pipelines

To add new pipelines or change existing pipelines, please read the [GitHub actions documentation](https://docs.github.com/en/actions)

### Pull requests

For each PR to `master` or `develop`, we run:
- [code lint](/.github/workflows/lint.yml)
- [tests](/.github/workflows/test.yml)

You must pass these checks to merge PR.

### Merge PR

After successfully merging your PR to `develop`, we start the process of [deployment](/.github/workflows/deploy_dev.yml) to the `dev` environment.

After successfully merging your PR to `master`, we start the process of [deployment](/.github/workflows/deploy_prod.yml) to the `prod` environment.

Before each deployment, we once again run code lint and tests.

## Code structure

The project has a typical structure for a NextJS@14 project, namely:

- `public`
  - `images` - the folder where all the images of the project are located
- `src`
  - `app` - the folder where all pages are located
  - `Components` - the folder where all common components are located
  - `hooks` - the folder where all react hooks are located
  - `services` - the folder where all services are located
  - `styles` - the folder where all styles are located
  - `tests` - the folder where all tests are located
  - `utils` - the folder where all utils are located
