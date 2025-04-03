# Pantheon Project

## Overview
This project contains a **frontend** and **backend** that are fully **dockerized** for easy deployment. You can use `docker compose` to start both services with a single command. This makes it easy for anyone to test and run the application locally.

## Requirements
- **Docker**: Ensure Docker is installed on your machine.
- **Docker Compose**: Ensure Docker Compose is installed on your machine.

## Quick Start

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/michaeltumiwa/pantheonTest.git
cd pantheonTest
```

### 2. Verify Docker Installation

Make sure that Docker and Docker Compose are installed on your machine:

```bash
docker --version
docker compose --version
```

If you don't have Docker installed, please follow the [Docker installation guide](https://docs.docker.com/get-docker/) and the [Docker Compose installation guide](https://docs.docker.com/compose/install/).

### 3. Change Directory to `reactCanvasProject` (if applicable)

If you need to go into a specific directory like `reactCanvasProject` (assuming it's in your project structure), run:

```bash
cd reactCanvasProject
```

This ensures you're in the correct directory where the `docker compose.yml` file is located.

### 4. Run the Application with Docker Compose

Once you're in the correct directory and have verified Docker is working, run the application using Docker Compose:

```bash
docker compose up
```

This command will:
- Pull the necessary Docker images (`frontend` and `backend`).
- Build the images (if they aren't available locally).
- Start the containers:
  - The **frontend** will run on `http://localhost:5173`.
  - The **backend** (GraphQL API) will run on `http://localhost:3000/graphql`.

### 5. Access the Application

Once the containers are up and running, you can visit the following URLs in your browser:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend (GraphQL)**: [http://localhost:3000/graphql](http://localhost:3000/graphql)

### 6. Stop the Application

To stop the application and remove the containers, use:

```bash
docker compose down
```

This will stop the containers and clean up any resources.

## Contributing

If you want to contribute to this project, feel free to fork it and create a pull request. Please make sure to follow the existing structure of the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
