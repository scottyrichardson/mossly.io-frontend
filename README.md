# Tooling setup

Project requires Node and Gulp to build.

Install Node. Then use NPM to install Gulp:

      npm install -g gulp

# Environment setup

Install project dependencies with:

      npm install

# Building the project

## Dev environment

Build the project with:

      gulp

or:

      gulp dev

## Prod environment

Build the project with

      gulp prod

# Updating project packages

Install npm-check-updates globally with:

      npm install -g npm-check-updates

Then check for latest project dependencies and set versions to package.json with:

      ncu -u

Finally, update the lockfile and install the new versions with:

      npm install
