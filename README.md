# Pocket Ledger - Philippine Edition

## Software Quality Engineering Final Project

Pocket Ledger is a lightweight React expense tracker that demonstrates automated software testing, code coverage, branch-specific continuous integration, SonarQube quality analysis, versioned release artifacts, and parameterized continuous delivery using Docker.

The application uses Philippine pesos (PHP).

## Project Status

The application, automated tests, Jenkins CI/CD pipelines, SonarQube integration, artifact generation, and DEV and TEST deployments have been successfully implemented and verified.

Verification date: November 26, 2026.

| Metric | Verified Result |
| --- | --- |
| Automated tests | 57 passed |
| Vitest statement coverage | 100% |
| Vitest branch coverage | 100% |
| Vitest function coverage | 100% |
| Vitest line coverage | 100% |
| SonarQube overall coverage | 98.6% |
| Required overall coverage | 80% |
| SonarQube quality gate | Passed |
| Reported SonarQube issues | 0 |
| SonarQube duplications | 0.0% |
| npm audit vulnerabilities | 0 reported |
| Production build | Successful |
| Accepted main CI build | #4 |
| Release artifact | expense-tracker-4.tar.gz |
| DEV deployment | Successful |
| TEST deployment | Successful |
| Controlled failure and recovery | Demonstrated |

These results describe the verified release and are not a guarantee that the software is free of defects or security vulnerabilities.

## Repository

https://github.com/etharial/expense-tracker-jenkins

## Application Features

- Record expenses with descriptions, amounts, categories, and dates.
- Display currency values in Philippine pesos.
- Validate expense descriptions, monetary amounts, categories, and calendar dates.
- Calculate monetary totals using integer centavo values.
- Display recently recorded expenses.
- Automatically update the total and expense count.
- Display validation errors and recover from invalid submissions.
- Reset the expense form after successful submissions.
- Display an empty state when no expenses have been recorded.

### Supported Categories

- Food
- Transport
- Housing
- Utilities
- Other

### Data Storage

Expenses are stored in React application memory.

Refreshing the browser resets the expense list. Persistent storage and a database are not implemented.

DEV and TEST are separate deployments, but their application data is maintained independently in browser memory.

## Technology Stack

| Technology | Purpose |
| --- | --- |
| React | User interface |
| JavaScript | Application logic |
| Vite | Development and production compilation |
| Vitest | Automated testing |
| React Testing Library | Component interaction testing |
| jsdom | Browser-like test environment |
| V8 and LCOV | Code coverage reporting |
| Git and GitHub | Version control and collaboration |
| Jenkins | Continuous integration and delivery |
| SonarQube Community Build | Static analysis and quality gates |
| Docker Desktop | Containerized infrastructure and deployment |
| Nginx | Serving the compiled React application |

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

Node.js 24 is the verified development and Jenkins runtime.

Clone the repository:

    git clone https://github.com/etharial/expense-tracker-jenkins.git
    cd expense-tracker-jenkins

Install dependencies:

    npm ci

Start the development server:

    npm run dev

Open the local URL printed by Vite.

## Automated Testing

Execute all tests:

    npm test

Generate the coverage report:

    npm run coverage

LCOV report location:

    coverage/lcov.info

### Test Suite

| Test File | Number of Tests |
| --- | ---: |
| tests/expenses.test.js | 46 |
| tests/App.test.jsx | 11 |
| Total | 57 |

The automated test suite covers:

- Valid expense creation.
- Invalid and empty descriptions.
- Invalid monetary amounts.
- Zero and negative amounts.
- Decimal currency precision.
- Supported and unsupported categories.
- Valid and invalid calendar dates.
- Empty application state.
- Form submission and reset.
- Multiple expense calculations.
- Validation error recovery.
- Preservation of existing expenses after invalid input.

### Test Improvement Results

| Metric | Original Baseline | Expanded Suite |
| --- | ---: | ---: |
| Passing tests | 9 | 57 |
| Statement coverage | 67.39% | 100% |
| Branch coverage | 78.26% | 100% |
| Function coverage | 63.63% | 100% |
| Line coverage | 68.18% | 100% |

Coverage applies to files included in the Vitest configuration.

SonarQube calculates its overall coverage independently and reported 98.6% for the verified project.

## Production Build

Generate the production application:

    npm run build

The compiled files are generated in:

    dist/

Preview the production build:

    npm exec vite -- preview

## Git Branch Strategy

| Branch | Purpose |
| --- | --- |
| main | Stable and accepted releases |
| develop | Integration of feature changes |
| feature/* | Isolated development work |

Feature changes are integrated through pull requests into develop, followed by release integration into main.

Formal teammate reviews should be used where required. The recorded PHP release pull requests did not contain formal GitHub reviews.

### Verified PHP Release Integration

| Pull Request | Integration | Result |
| --- | --- | --- |
| #3 | feature/php-currency-localization into develop | Merged |
| #4 | develop into main | Merged |

### Release Commit References

PHP localization:

    c034a70044d7e378f70d839cd3dea9a6d674fb3d

Intentional test failure:

    6cf0d6f640d6224ce2172edee2dd2a108fb531f9

Test recovery:

    672b674750d1e4dffebb3da3790f89fa4163db3f

Develop integration:

    4681a2bc5f60717d02c54a3b7c0f0357bfc6e53a

Accepted main release:

    e2e96883c65614b08b6e7ed7ce1293d1b0eb6676

## CI/CD Architecture

    GitHub feature branch
            |
            v
    Jenkins automated tests and coverage
            |
            v
    Pull request into develop
            |
            v
    Jenkins tests, coverage and production build
            |
            v
    Pull request into main
            |
            v
    Jenkins tests and coverage
            |
            v
    SonarQube analysis
            |
            v
    Quality gate acceptance
            |
            v
    Production build
            |
            v
    Versioned and fingerprinted artifact
            |
            v
    Parameterized Jenkins CD pipeline
            |
            v
    Docker deployment
            |
            +---- DEV
            +---- TEST
            +---- ACC
            +---- PROD

DEV and TEST have been successfully deployed and tested.

ACC and PROD are configured deployment options but have not been live-tested.

## Jenkins Continuous Integration

Jenkins URL:

    http://localhost:8080

Multibranch Pipeline job:

    expense-tracker-jenkins

Display name:

    Pocket Ledger - CI

Pipeline script:

    Jenkinsfile

Repository:

    https://github.com/etharial/expense-tracker-jenkins.git

Configure the GitHub repository as the branch source.

Enable branch discovery for main, develop, and feature branches.

Periodic multibranch scanning discovers new branches. The Jenkinsfile also configures SCM polling approximately every five minutes.

Automatic execution following an SCM change was verified during release integration.

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

| Tool | Jenkins Configuration Name |
| --- | --- |
| Node.js 24 | NodeJS-24 |
| SonarQube Scanner | SonarScanner |
| SonarQube server | SonarQube |

Verified Jenkins runtime:

- Node.js 24.22.3
- npm 11.19.1

The Linux build agent requires Git, shell utilities, and tar.

The deployment agent requires Docker CLI access and permission to access the Docker daemon.

### Branch-Specific Pipeline Behavior

| Stage | feature/category-filter | Other feature/* | develop | main |
| --- | --- | --- | --- | --- |
| Checkout | Yes | Yes | Yes | Yes |
| Install and Test | Yes | Yes | Yes | Yes |
| Coverage | Yes | Yes | Yes | Yes |
| SonarQube Analysis | Yes | No | No | Yes |
| Quality Gate | Yes, if analysis succeeds | No | No | Yes |
| Build | No | No | Yes | Yes |
| Archive Artifact | No | No | No | Yes |

A failed automated test stops the affected pipeline.

A failed main-branch quality gate prevents the production build and artifact archive stages from completing.

For the quality-gate failure demonstration, `src/expenses.js` contains an intentionally untested helper. Its uncovered new lines should put new-code coverage below the 80% gate threshold after it reaches `main`, preventing the build and artifact stages.

### Verified CI Executions

| Branch | Build | Result |
| --- | --- | --- |
| feature/php-currency-localization | #1 | SUCCESS - 57 tests passed |
| feature/php-currency-localization | #2 | FAILURE - intentional assertion failure |
| feature/php-currency-localization | #3 | SUCCESS - corrected assertion |
| develop | #3 | SUCCESS - tests, coverage and production build |
| main | #3 | SUCCESS - original USD release |
| main | #4 | SUCCESS - accepted PHP release |

Main CI Build #4 is the designated PHP demonstration release.

## SonarQube Configuration

SonarQube dashboard:

    http://localhost:9000/dashboard?id=expense-tracker-jenkins

Project key:

    expense-tracker-jenkins

Quality gate:

    Pocket-Ledger-Quality-Gate

Configuration file:

    sonar-project.properties

LCOV report:

    coverage/lcov.info

Internal SonarQube server URL:

    http://sonarqube:9000

Project-specific Jenkins webhook:

    http://jenkins:8080/sonarqube-webhook/

Jenkins and SonarQube share the quality-lab Docker network.

The `main` and `feature/category-filter` branches are configured for SonarQube analysis. The feature scan explicitly requests branch analysis; the configured SonarQube Community Build does not support non-main branch analysis, so that feature pipeline is expected to fail in the SonarQube Analysis stage. The application's category filter and tests remain correct. Main continues to run analysis and gate checks before creating a release artifact.

### Quality Gate Results

| Metric | Verified Result |
| --- | --- |
| Minimum required overall coverage | 80% |
| Actual overall coverage | 98.6% |
| Margin above required coverage | 18.6 percentage points |
| Reported issues | 0 |
| Duplications | 0.0% |
| Quality gate | PASSED |

Main CI Build #4 successfully uploaded its analysis report, waited for the quality gate result, and continued to production compilation after receiving an OK status.

The SonarQube dashboard reported no issues under the active analysis configuration.

A zero-issue result does not establish that all possible defects or vulnerabilities are absent.

SonarQube Community Build compatibility with the instructor's requirements should be confirmed during final submission review.

## Versioned CI Artifacts

After the main branch passes automated tests and the quality gate, Jenkins compiles the application and archives a deployment package.

The artifact contains:

    dist/
    Dockerfile

Artifact naming convention:

    expense-tracker-<CI_BUILD_NUMBER>.tar.gz

### Accepted PHP Release

| Property | Value |
| --- | --- |
| Main CI build | #4 |
| Artifact | expense-tracker-4.tar.gz |
| Artifact size | 70.69 KiB |
| Quality gate | Passed |
| Fingerprint | Recorded |
| Source branch | main |

Artifact location:

    http://localhost:8080/job/expense-tracker-jenkins/job/main/4/artifact/

The archived artifact contains the compiled application and Dockerfile.

It does not contain node_modules or the original React source files.

Main CI Build #4 has been retained for the classroom demonstration.

## Jenkins Continuous Delivery

CD Pipeline job:

    Pocket-Ledger-CD

Job URL:

    http://localhost:8080/job/Pocket-Ledger-CD/

Pipeline script:

    Jenkinsfile.cd

The CD job loads its script from the repository main branch.

### Deployment Parameters

| Parameter | Description |
| --- | --- |
| CI_BUILD_NUMBER | Successful main CI build number |
| ENVIRONMENT | DEV, TEST, ACC, or PROD |

Source CI job:

    expense-tracker-jenkins/main

### Delivery Process

1. Validate the selected CI build and environment.
2. Retrieve the selected versioned CI artifact.
3. Extract the compiled application and Dockerfile.
4. Verify the deployment context.
5. Build the Docker image.
6. Verify existing container ownership when replacing a deployment.
7. Deploy to the selected environment.
8. Verify the running container and its HTTP response.

The CD pipeline does not recompile React.

### Deployment Environments

| Environment | Container | Port | Verification |
| --- | --- | ---: | --- |
| DEV | pocket-ledger-dev | 3001 | Verified |
| TEST | pocket-ledger-test | 3002 | Verified |
| ACC | pocket-ledger-acc | 3003 | Configured only |
| PROD | pocket-ledger-prod | 3004 | Configured only |

Application URLs:

- DEV: http://localhost:3001
- TEST: http://localhost:3002
- ACC: http://localhost:3003
- PROD: http://localhost:3004

ACC and PROD will not be accessible until their containers are deployed.

The four environments represent classroom demonstration environments on a single Docker host.

### Verified CD Executions

| CD Build | Source CI Build | Environment | Result |
| --- | --- | --- | --- |
| #1 | Invalid selection | Not deployed | Expected FAILURE |
| #2 | #3 | DEV | SUCCESS - USD release |
| #3 | #4 | DEV | SUCCESS - PHP upgrade |
| #4 | #4 | DEV | SUCCESS - repeated deployment |
| #5 | #4 | TEST | SUCCESS - separate environment |

### Accepted Deployment Image

    pocket-ledger:4

Both verified PHP environments use the same accepted CI artifact.

Docker container labels identify the project, deployment environment, and CI build number.

The pipeline refuses to replace containers belonging to unrelated projects.

Redeployment may briefly interrupt the selected environment. Automatic rollback is not implemented.

### Manual Redeployment

To redeploy a previously accepted release, select its retained main CI build number and the desired environment in the CD job.

Verify that the corresponding artifact remains available.

## Live Functional Verification

Both DEV and TEST displayed the Philippine peso currency symbol and the Amount (PHP) field.

### DEV

| Check | Result |
| --- | --- |
| Browser accessibility | Passed |
| Initial zero balance | Passed |
| Currency formatting | Passed |
| Expense submission | Passed |
| Expense count | Passed |
| Recorded total | PHP 325.00 |

### TEST

| Check | Result |
| --- | --- |
| Browser accessibility | Passed |
| Initial zero balance | Passed |
| Currency formatting | Passed |
| Multiple expense submissions | Passed |
| Combined total | PHP 1,357.00 |
| Expense count | 2 |

Both environments were verified using the selected Main CI Build #4 release.

## Controlled CI Failure and Recovery

The controlled failure demonstration was performed on:

    feature/php-currency-localization

### Build #1 - Successful Baseline

Commit:

    c034a70

Result:

- 57 automated tests passed.
- 100% Vitest coverage.
- Pipeline completed successfully.

### Build #2 - Intentional Failure

Commit:

    6cf0d6f

An automated test assertion was intentionally modified to expect an incorrect initial balance of PHP 999.99 instead of PHP 0.00.

Result:

- 56 automated tests passed.
- One automated test failed.
- Test command returned exit code 1.
- Jenkins marked the pipeline as failed.
- Coverage and subsequent stages were skipped.

Application source code was not modified for this demonstration.

### Build #3 - Successful Recovery

Commit:

    672b674

The correct assertion was restored.

Result:

- 57 automated tests passed.
- 100% Vitest coverage.
- Pipeline completed successfully.
- The corrected Git tree exactly matched the original successful PHP baseline.

The failure and recovery commits remain available for historical demonstration.

The intentionally incorrect assertion is absent from the accepted release.

## Dependency Security

Execute:

    npm audit

The verified dependency audit on November 26, 2026 reported:

    found 0 vulnerabilities

The result reflects the vulnerability information available at the time of the audit.

Run the audit again before final submission if required.

Do not commit node_modules, coverage reports, production build directories, passwords, environment secrets, or access tokens.

Store authentication credentials in Jenkins rather than in the source repository.

## Security Considerations and Known Limitations

This CI/CD infrastructure is designed for local classroom evaluation, not production use.

### SonarQube Webhook Security

- Forced user authentication remains enabled.
- No global webhooks are configured.
- Pocket Ledger uses a project-specific webhook.
- Jenkins and SonarQube communicate through the quality-lab Docker network.
- Local webhook destination validation is temporarily disabled.
- This setting applies globally to the SonarQube instance.
- The project webhook does not currently use a shared secret.
- Successful webhook delivery has been verified.

Disabling local destination validation introduces security risks.

The exception is retained temporarily to preserve the working classroom demonstration.

Restore validation after the demonstration and reconfigure the integration as necessary. Configure authenticated webhook delivery and appropriate network restrictions before production use.

### Docker Network Exposure

The published Docker ports are bound to all host interfaces, including IPv6 bindings where configured.

Actual network accessibility depends on host firewall and network configuration.

Do not expose Jenkins, SonarQube, or the application containers to untrusted networks.

Jenkins Docker daemon access also requires a trusted and restricted execution environment.

### GitHub Commit Status Reporting

Jenkins reports a GitHub commit-status permission warning.

Repository checkout, branch discovery, SCM-triggered execution, testing, and deployment remain functional.

Successful reporting of Jenkins commit statuses back to GitHub has not been established.

Review repository permissions and use appropriately scoped credentials before enabling this functionality.

### Docker Builder

Docker reports a legacy builder deprecation warning.

The warning did not prevent successful image generation or deployment.

Migration to BuildKit is recommended for future maintenance.

### SonarQube Database

The SonarQube installation uses an embedded evaluation database.

This configuration is intended for educational evaluation rather than production workloads.

### Application Limitations

- Expenses are stored in browser memory.
- Refreshing the page resets application data.
- Persistent storage is not implemented.
- ACC and PROD deployment options are configured but untested.
- Automatic deployment rollback is not implemented.
- Automated testing and static analysis cannot guarantee defect-free software.

## Troubleshooting

### Node.js is not found in Jenkins

Verify that the NodeJS plugin and NodeJS-24 managed tool are configured.

### SonarQube coverage is missing

Verify that coverage/lcov.info exists and that the configured report path matches the analyzed source files.

### Quality gate timeout

Verify Jenkins connectivity, SonarQube background task status, and the project webhook delivery status.

Review local webhook validation settings and network restrictions.

### Artifact retrieval fails

Verify the selected CI build number, source job, artifact filename, build retention, and Copy Artifact permissions.

### Docker deployment fails

Verify Docker Desktop availability, Jenkins Docker daemon access, container ownership labels, and selected port availability.

### Application displays the previous currency

Verify the selected CI build number and deployed Docker image.

The accepted PHP release uses Main CI Build #4 and Docker image pocket-ledger:4.

Refresh the browser if cached content is suspected.

## Submission Evidence Checklist

### Verified Technical Milestones

- [x] GitHub repository and required project files.
- [x] Feature, develop, and main branch strategy.
- [x] Jenkins Multibranch Pipeline.
- [x] Successful feature-branch tests.
- [x] Successful develop tests and production build.
- [x] Successful main CI pipeline.
- [x] Imported LCOV coverage.
- [x] SonarQube quality gate acceptance.
- [x] Overall SonarQube coverage above 80%.
- [x] Versioned and fingerprinted CI artifact.
- [x] Controlled automated test failure.
- [x] Successful recovery pipeline.
- [x] Parameterized CD deployment.
- [x] Successful DEV deployment.
- [x] Successful TEST deployment.
- [x] Browser-level functional verification.
- [x] Dependency security audit.
- [x] Security configuration assessment.

### Final Submission Activities

- [ ] Organize required screenshots and console evidence.
- [ ] Confirm SonarQube finding review requirements with the instructor.
- [ ] Confirm Community Build compatibility with the instructor.
- [ ] Complete final instructor rubric verification.
- [ ] Record the required five-to-eight-minute demonstration.
- [ ] Assemble and submit the final materials.

## Demonstration Release Summary

Application:

    Pocket Ledger - Philippine Edition

Accepted main CI build:

    #4

Release artifact:

    expense-tracker-4.tar.gz

Docker image:

    pocket-ledger:4

Verified deployment environments:

    DEV  - http://localhost:3001
    TEST - http://localhost:3002

Automated tests:

    57 passed

Vitest coverage:

    100%

SonarQube overall coverage:

    98.6%

SonarQube quality gate:

    PASSED

The application and core CI/CD implementation are complete. Final evidence organization, instructor requirement verification, and the recorded demonstration remain submission activities.
