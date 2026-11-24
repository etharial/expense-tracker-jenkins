# Pocket Ledger — Expense Tracker

A small React expense tracker built to demonstrate branch-aware Jenkins CI and a separate, build-number-driven CD job. Expenses are held in memory and reset when the page is refreshed.

## GitHub repository and branches

| Branch | Purpose | CI stages |
| --- | --- | --- |
| `main` | Stable, accepted release | Test, SonarQube analysis, quality gate, build, archive |
| `develop` | Integration branch | Test, build |
| `feature/<name>` | Individual feature work, e.g. `feature/category-filter` | Test |

Use pull requests from `feature/*` to `develop`, then from `develop` to `main`. Only a successful `main` pipeline archives `release-bundle.tar.gz`; the CD job copies that artifact from the chosen `main` build.

After creating the GitHub repository, initialize and push the branches (replace the URL with your repository URL):

```sh
git init -b main
git add .
git commit -m "Initial expense tracker"
git remote add origin https://github.com/<your-user>/expense-tracker-jenkins.git
git push -u origin main
git switch -c develop
git push -u origin develop
git switch -c feature/expense-form
git push -u origin feature/expense-form
```

## Run locally

Requirements: Node.js 20.19+ (or 22.12+) and npm.

```sh
npm ci
npm test
npm run coverage
npm run build
npm run dev
```

The expense helpers validate descriptions, categories, dates, and positive amounts with at most two decimal places. Amounts are stored and totaled as integer cents to avoid floating-point currency errors.

## Jenkins CI setup

1. Push this repository to GitHub and create the branches above.
2. Create a Jenkins **Multibranch Pipeline** pointing at the repository, with branch discovery enabled. Set its script path to `Jenkinsfile`.
3. Ensure its build agent has Node.js/npm and Git. The `main` branch runs SonarQube analysis and the quality gate; configure the Jenkins SonarQube Scanner tool as **`SonarScanner`** and the SonarQube server installation as **`SonarQube`**. Install/configure the SonarQube Scanner and Pipeline plugins.
4. `sonar-project.properties` configures the project key and LCOV coverage path. Configure a SonarQube webhook to Jenkins for `waitForQualityGate`.

The pipeline uses `npm ci` and `npm run coverage` for all discovered branches. It runs `npm run build` only for `develop` and `main`. An artifact is archived only after the `main` analysis and quality gate succeed.

## Jenkins CD setup

1. Install the **Copy Artifact** plugin. Create a separate Jenkins Pipeline job pointing at this repository and set its script path to `Jenkinsfile.cd`.
2. Run the CD job with `MAIN_BRANCH_JOB` set to the multibranch branch-job path ending in `/main` (default: `expense-tracker-jenkins/main`), `SOURCE_BUILD_NUMBER` set to the successful CI build number, and `DEPLOY_PORT` set to an available host port.
3. The deployment agent must have Docker installed and permission to use its daemon. The job retrieves the selected main artifact, builds the included Dockerfile, and replaces the `expense-tracker` container on that agent. The application is then available at `http://<deployment-agent>:<DEPLOY_PORT>`.

No credentials or environment-specific secrets are stored in this repository. Add GitHub credentials through Jenkins credentials and restrict access to the deployment job as appropriate.
