# Pocket Ledger - Expense Tracker

Pocket Ledger is a lightweight React expense tracker developed for the Software Quality Engineering final project.

The project demonstrates automated testing, code coverage, branch-aware Jenkins continuous integration, SonarQube quality analysis, versioned artifacts, and parameterized Docker deployment.

## Repository

https://github.com/etharial/expense-tracker-jenkins

## Application Features

- Record expenses with descriptions, amounts, categories, and dates.
- Validate descriptions, amounts, categories, and calendar dates.
- Calculate totals using integer cents.
- Display the most recently added expenses.
- Display validation errors and recover from invalid submissions.
- Display an empty state when no expenses have been recorded.

The application uses USD and stores expenses in memory. Refreshing the page resets the expense list. A database is not required.

## Technology Stack

| Technology | Purpose |
| --- | --- |
| React | User interface |
| Vite | Development and production builds |
| JavaScript | Application logic |
| Vitest | Automated testing |
| React Testing Library | Component interaction testing |
| jsdom | Browser-like test environment |
| V8 and LCOV | Coverage reporting |
| GitHub | Version control |
| Jenkins | CI/CD automation |
| SonarQube | Code analysis and quality gates |
| Docker | Containerized deployment |
| Nginx | Production web server |

## Repository Structure

    expense-tracker-jenkins/
    |-- src/
    |   |-- App.jsx
    |   |-- expenses.js
    |   |-- main.jsx
    |   |-- styles.css
    |-- tests/
    |   |-- App.test.jsx
    |   |-- expenses.test.js
    |-- .gitignore
    |-- Dockerfile
    |-- Jenkinsfile
    |-- Jenkinsfile.cd
    |-- README.md
    |-- index.html
    |-- package.json
    |-- package-lock.json
    |-- sonar-project.properties
    |-- vite.config.js

## Local Development

Node.js 24 is the verified local testing environment and configured Jenkins tool target.

Clone the repository:

    git clone https://github.com/etharial/expense-tracker-jenkins.git
    cd expense-tracker-jenkins

Install dependencies:

    npm ci

Start the development server:

    npm run dev

Open the local URL printed by Vite.

## Automated Testing

Execute all automated tests:

    npm test

Generate code coverage:

    npm run coverage

The LCOV report is generated at:

    coverage/lcov.info

The expanded test suite contains 57 tests:

- 46 expense calculation and validation tests.
- 11 React application tests.

Tests cover valid inputs, invalid inputs, boundary conditions, currency calculations, calendar validation, form interactions, dynamic totals, and error recovery.

### Verified Local Results

| Metric | Original baseline | Expanded suite |
| --- | ---: | ---: |
| Passing tests | 9 | 57 |
| Statement coverage | 67.39% | 100% |
| Branch coverage | 78.26% | 100% |
| Function coverage | 63.63% | 100% |
| Line coverage | 68.18% | 100% |

These results were recorded locally on November 26, 2026.

Coverage applies to files included in the Vitest configuration. SonarQube overall coverage and quality gate results must be independently verified.

Coverage does not guarantee defect-free software.

## Production Build

Generate the compiled application:

    npm run build

The production files are generated in dist/.

Preview the production build:

    npm exec vite -- preview

## Git Branch Strategy

| Branch | Purpose |
| --- | --- |
| main | Stable and accepted releases |
| develop | Integration of feature changes |
| feature/* | Individual development work |

Use reviewed pull requests to integrate feature changes into develop and develop into main.

## Jenkins Continuous Integration

Create a Multibranch Pipeline named expense-tracker-jenkins.

Configure the GitHub repository as its branch source and use Jenkinsfile as its script path.

Enable branch discovery for main, develop, and feature branches.

Configure periodic multibranch scanning to discover newly created branches.

The Jenkinsfile also polls discovered branches approximately every five minutes.

### Required Jenkins Plugins

- Git
- GitHub Branch Source
- Pipeline
- Workflow Multibranch
- NodeJS
- SonarQube Scanner for Jenkins
- Copy Artifact
- Credentials

### Managed Tools

| Tool | Configuration name |
| --- | --- |
| Node.js 24 | NodeJS-24 |
| SonarQube Scanner | SonarScanner |
| SonarQube server | SonarQube |

The Linux build agent requires Git, shell utilities, and tar.

The deployment agent requires Docker CLI access and permission to use the Docker daemon.

### Branch-Specific Pipeline Stages

| Stage | feature/* | develop | main |
| --- | --- | --- | --- |
| Checkout | Yes | Yes | Yes |
| Install and Test | Yes | Yes | Yes |
| Coverage | Yes | Yes | Yes |
| SonarQube Analysis | No | No | Yes |
| Quality Gate | No | No | Yes |
| Build | No | Yes | Yes |
| Archive Artifact | No | No | Yes |

A failed automated test stops the affected pipeline.

A failed main-branch quality gate prevents the production build and archive stages from completing.

## SonarQube Configuration

Project key:

    expense-tracker-jenkins

Configuration file:

    sonar-project.properties

SonarQube imports coverage/lcov.info generated by Vitest.

Configure and assign a project-specific quality gate requiring at least 80 percent overall coverage.

Evaluate overall code coverage, not only coverage on new code.

Only the main branch is analyzed.

Confirm Community Build compatibility with the instructor before relying on the main-branch Multibranch integration.

Internal SonarQube server URL:

    http://sonarqube:9000

SonarQube webhook URL:

    http://jenkins:8080/sonarqube-webhook/

These internal URLs require Jenkins and SonarQube to share a Docker network.

Store authentication tokens in Jenkins credentials, never in the GitHub repository.

## Versioned CI Artifacts

After the main branch passes its tests and quality gate, Jenkins generates a production build.

The archived package contains:

    dist/
    Dockerfile

The archive filename includes the selected main CI build number:

    expense-tracker-<CI_BUILD_NUMBER>.tar.gz

Example:

    expense-tracker-12.tar.gz

The archive is stored in the main branch Jenkins job and fingerprinted.

The archive does not include node_modules or original React source files.

## Jenkins Continuous Delivery

Create a separate Pipeline job named:

    Pocket-Ledger-CD

Configure the job to load its script from the repository main branch.

Script path:

    Jenkinsfile.cd

### Deployment Parameters

| Parameter | Description |
| --- | --- |
| CI_BUILD_NUMBER | Successful main CI build number |
| ENVIRONMENT | DEV, TEST, ACC, or PROD |

The source CI job is:

    expense-tracker-jenkins/main

The CD pipeline retrieves the selected CI artifact, extracts its compiled application and Dockerfile, builds a Docker image, deploys the selected environment, and verifies its HTTP response.

The CD pipeline does not rebuild the React source.

### Deployment Environments

| Environment | Container | Port | Local URL |
| --- | --- | ---: | --- |
| DEV | pocket-ledger-dev | 3001 | http://localhost:3001 |
| TEST | pocket-ledger-test | 3002 | http://localhost:3002 |
| ACC | pocket-ledger-acc | 3003 | http://localhost:3003 |
| PROD | pocket-ledger-prod | 3004 | http://localhost:3004 |

The assigned ports must be available on the Docker host.

Docker images are tagged using the selected CI build number.

Example:

    pocket-ledger:12

Containers include project ownership, environment, and CI build labels.

The pipeline refuses to replace containers belonging to unrelated projects.

Redeploying to the same environment may briefly interrupt service. Automatic rollback is not implemented.

The four environments represent classroom demonstration environments on one Docker host.

## Dependency Security

Run the dependency audit:

    npm audit

The local audit on November 26, 2026 reported zero vulnerabilities.

Run the audit again before final submission because vulnerability reports may change.

## Failure and Recovery Demonstration

The planned demonstration uses a controlled failing test on a feature branch.

1. Introduce an intentionally incorrect test assertion.
2. Trigger the feature-branch Jenkins CI pipeline.
3. Capture the failed test and stopped pipeline.
4. Correct the assertion.
5. Trigger another CI build.
6. Capture the successful rerun.

Record the actual failing and corrected Jenkins build numbers.

The intentionally failing assertion must not remain in the submitted application.

## Troubleshooting

### Node.js is not found in Jenkins

Verify that the NodeJS plugin and NodeJS-24 managed tool are configured.

### SonarQube coverage is missing

Verify that coverage/lcov.info exists and that report paths match the analyzed source files.

### Quality gate timeout

Verify Jenkins connectivity, SonarQube task status, and webhook configuration.

### Artifact retrieval fails

Verify the selected CI build number, source job, artifact filename, and Copy Artifact permissions.

### Docker deployment fails

Verify that Docker Desktop is running, Jenkins can access the Docker daemon, and the selected port is available.

## Submission Evidence Checklist

- [ ] GitHub repository link and required project files.
- [ ] Jenkins Multibranch Pipeline showing required branches.
- [ ] Successful feature-branch test run.
- [ ] Successful develop test and build.
- [ ] Successful main CI pipeline.
- [ ] SonarQube dashboard and imported coverage.
- [ ] Configured overall coverage quality gate and result.
- [ ] Reviewed SonarQube finding or instructor-approved example.
- [ ] Versioned artifact and CI build number.
- [ ] Failed Pipeline demonstration.
- [ ] Corrected and successful Pipeline rerun.
- [ ] CD parameter selection.
- [ ] Successful Docker deployment.
- [ ] Deployed application in a browser.
- [ ] Final npm audit result.
- [ ] Five-to-eight-minute recorded demonstration.

## Repository Security

Do not commit node_modules, coverage, dist, passwords, environment secrets, or access tokens.

Use Jenkins credentials for authentication and restrict access to deployment jobs.

## Project Status

The application and expanded automated tests have passed local verification.

Live Jenkins execution, SonarQube quality gate acceptance, artifact retrieval, and Docker deployment must still be verified before final submission.
