# Todo Application API

This project is a RESTful API for a Todo Application built with Node.js and SQLite. It provides endpoints for creating, reading, updating, and deleting todos.

## Table of Contents

- [Introduction](#introduction)
- [Functionality](#functionality)
- [Implementation](#implementation)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Todo Application API is a backend service designed to manage todos. It is built using Node.js, a powerful environment for developing server-side applications, and SQLite, a self-contained, serverless, and zero-configuration database engine.

## Functionality

The application provides the following functionality:

- **Create a new todo**: Users can create a new todo item with details such as the task, category, priority, status, and due date.
- **Retrieve all todos**: Users can retrieve a list of all their todos.
- **Retrieve a specific todo**: Users can retrieve a specific todo by its ID, task, category, priority, status, and due date.
- **Update a todo**: Users can update the details of a todo, including its task, category, priority, status, and due date.
- **Delete a todo**: Users can delete a todo by its ID.

## Implementation

The application is implemented using Express.js, a minimal and flexible Node.js web application framework. It provides a robust set of features for web and mobile applications. SQLite is used as the database to store the todos, providing a lightweight disk-based database that doesn’t require a separate server process.

The application uses the MVC (Model-View-Controller) design pattern, where the Controller handles the HTTP requests, the Model interacts with the SQLite database, and the View is not implemented as this is a RESTful API.

## Installation

To install and run the project, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd <project-directory>`
3. Install the required packages: `npm install`
4. Start the server: `node app.js`

The server will start running on `http://localhost:3000`.

## API Endpoints

The application provides the following API endpoints:

- **GET /todos/**: Retrieves a list of all todos.
- **GET /todos/:todoId/**: Retrieves a specific todo by its ID, task, category, priority, status, and due date.
- **POST /todos/**: Creates a new todo.
- **PUT /todos/:todoId/**: Updates a specific todo by its ID, task, category, priority, status, and due date.
- **DELETE /todos/:todoId/**: Deletes a specific todo by its ID.
