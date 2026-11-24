# Pocket Ledger — Expense Tracker

A small React expense tracker built to demonstrate branch-aware Jenkins CI and a separate, build-number-driven CD job. Expenses are held in memory and reset when the page is refreshed.

## GitHub repository and branches

| Branch | Purpose | CI stages |
| --- | --- | --- |
| `main` | Stable, accepted release | Checkout, install and test, coverage, SonarQube analysis, quality gate, build, archive |
| `develop` | Integration branch | Checkout, install and test, coverage, build |
| `feature/<name>` | Individual feature work, e.g. `feature/category-filter` | Checkout, install and test, coverage |

Use pull requests from `feature/*` to `develop`, then from `develop` to `main`. Only a successful `main` pipeline archives `release-bundle.tar.gz`; the CD job copies that artifact from the chosen `main` build.

After creating the GitHub repository, initialize and push the branches (replace the URL with your repository URL):

```sh
git init -b main
git add .
git commit -m "Initial expense tracker"
git remote add origin https://github.com/etharial/expense-tracker-jenkins.git
git push -u origin main
git switch -c develop
git push -u origin develop
git switch -c feature/category-filter
git push -u origin feature/category-filter
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

1. Push `main`, `develop`, and at least one `feature/*` branch to GitHub.
2. Install the **GitHub Branch Source** plugin. In Jenkins, create a **Multibranch Pipeline** and add a GitHub branch source for `https://github.com/etharial/expense-tracker-jenkins`. Configure GitHub credentials if the repository requires them, set the source's branch-discovery behavior to discover **all branches**, and set the script path to `Jenkinsfile`. Do not filter out `main`, `develop`, or `feature/*`.
3. Configure the multibranch job to scan periodically (for example, every 5 minutes) so newly created branches are discovered. The Jenkinsfile also polls each discovered branch for changes every 5 minutes. For immediate push triggering, configure a GitHub repository webhook at `https://<your-jenkins-host>/github-webhook/` for push events, and ensure the Jenkins host is reachable from GitHub.
4. Ensure the build agent has Git, Node.js 22.12+ (or 20.19+), and npm. Install/configure the SonarQube Scanner and Pipeline plugins; configure the Jenkins scanner tool as **`SonarScanner`** and the server installation as **`SonarQube`**.
5. `sonar-project.properties` configures the project key and LCOV coverage path. Configure a SonarQube webhook to Jenkins for `waitForQualityGate`.

The branch pipeline runs the stages shown in the table: a failing `npm test` or coverage command stops that branch's pipeline. On `main`, a failed SonarQube quality gate aborts the pipeline before build and archive. Only `main` archives `release-bundle.tar.gz`.

## Jenkins CD setup

1. Install the **Copy Artifact** plugin. Create a separate Jenkins Pipeline job pointing at this repository and set its script path to `Jenkinsfile.cd`.
2. Run the CD job with `MAIN_BRANCH_JOB` set to the multibranch branch-job path ending in `/main` (default: `expense-tracker-jenkins/main`), `SOURCE_BUILD_NUMBER` set to the successful CI build number, and `DEPLOY_PORT` set to an available host port.
3. The deployment agent must have Docker installed and permission to use its daemon. The job retrieves the selected main artifact, builds the included Dockerfile, and replaces the `expense-tracker` container on that agent. The application is then available at `http://<deployment-agent>:<DEPLOY_PORT>`.

No credentials or environment-specific secrets are stored in this repository. Add GitHub credentials through Jenkins credentials and restrict access to the deployment job as appropriate.
