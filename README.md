# Batch Git Repository Cloner

## Description

This script allows you to clone multiple Git repositories in batch from a list provided in a `.txt` or `.xlsx` file. It organizes the cloned repositories into a specified local workspace directory, preserving the original folder structure from the Git provider.

## Features

- Clone repositories from a list in a `.txt` file.
- Clone repositories from a list in an `.xlsx` file.
- Automatically creates the directory structure based on the repository URL.
- Configures user name and email for each cloned repository.
- Avoids re-cloning if the repository already exists.
- Updates the remote URL for existing repositories.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)

## Installation

1. Clone this repository or download the source code.

2. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root of the project by copying the `.env.sample` file:
   ```bash
   copy .env.sample .env
   ```

2. Edit the `.env` file with your specific configuration:

   - `REPOSITORIES_FILE_PATH`: The absolute path to the file (`.txt` or `.xlsx`) containing the list of repository URLs.
   - `WORKSPACE_PATH`: The absolute path to the directory where the repositories will be cloned.
   - `DISPLAY_NAME`: Your Git display name.
   - `EMAIL`: Your Git email.
   - `BASE_URL_TO_REPLACE`: The base URL of your Git provider (e.g., `git@bitbucket.org:your-org`) that will be removed to create the local directory structure.
   - `SHEET_INDEX`: If using an `.xlsx` file, the index of the sheet containing the repository URLs (starting from 0).

## Usage

Once you have configured your `.env` file, run the script:

```bash
node main.js
```

The script will read the repository URLs from the specified file and clone them into your workspace directory.