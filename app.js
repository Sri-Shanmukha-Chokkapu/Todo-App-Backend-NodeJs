const express = require("express");
const app = express();

const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const format = require("date-fns/format");
const isMatch = require("date-fns/isMatch");
const isValid = require("date-fns/isValid");

app.use(express.json());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server is Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`Database Error: ${error}`);
  }
};

initializeDBAndServer();

const convertDBObject = (todoObject) => {
  return {
    id: todoObject.id,
    todo: todoObject.todo,
    category: todoObject.category,
    priority: todoObject.priority,
    status: todoObject.status,
    dueDate: todoObject.due_date,
  };
};

const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasCategoryAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};

const hasCategoryAndPriorityProperties = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};

const hasTodoProperty = (requestQuery) => {
  return requestQuery.search_q !== undefined;
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasCategoryProperty = (requestQuery) => {
  return requestQuery.category !== undefined;
};

//API 1
//GET Returns a list of all todos
app.get("/todos/", async (request, response) => {
  let data = null;
  const { search_q = "", status, priority, category } = request.query;

  let getTodosQuery = "";

  switch (true) {
    case hasPriorityAndStatusProperties(request.query):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        if (
          status === "TO DO" ||
          status === "IN PROGRESS" ||
          status === "DONE"
        ) {
          getTodosQuery = `
                SELECT
                    *
                FROM
                    todo
                WHERE 
                    status ='${status}'
                    AND priority = '${priority}';`;
          data = await db.all(getTodosQuery);
          response.send(data.map((eachTodo) => convertDBObject(eachTodo)));
        } else {
          response.status(400);
          response.send("Invalid Todo Status");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }

      break;

    case hasCategoryAndStatusProperties(request.query):
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        if (
          status === "TO DO" ||
          status === "IN PROGRESS" ||
          status === "DONE"
        ) {
          getTodosQuery = `
                SELECT
                    *
                FROM
                    todo
                WHERE 
                    status ='${status}'
                    AND category = '${category}';`;
          data = await db.all(getTodosQuery);
          response.send(data.map((eachTodo) => convertDBObject(eachTodo)));
        } else {
          response.status(400);
          response.send("Invalid Todo Status");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;

    case hasCategoryAndPriorityProperties(request.query):
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        if (
          priority === "HIGH" ||
          priority === "MEDIUM" ||
          priority === "LOW"
        ) {
          getTodosQuery = `
                SELECT
                    *
                FROM
                    todo
                WHERE 
                    category = '${category}'
                    AND priority = '${priority}';`;
          data = await db.all(getTodosQuery);
          response.send(data.map((eachTodo) => convertDBObject(eachTodo)));
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;

    case hasPriorityProperty(request.query):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        getTodosQuery = `
                    SELECT
                    *
                    FROM
                    todo
                    WHERE 
                    priority = '${priority}';`;
        data = await db.all(getTodosQuery);
        response.send(data.map((eachTodo) => convertDBObject(eachTodo)));
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;

    case hasStatusProperty(request.query):
      if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
        getTodosQuery = `
                SELECT
                *
                FROM
                todo
                WHERE 
                todo LIKE '%${search_q}%'
                AND status ='${status}';`;
        data = await db.all(getTodosQuery);
        response.send(data.map((eachTodo) => convertDBObject(eachTodo)));
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;
    case hasCategoryProperty(request.query):
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        getTodosQuery = `
                SELECT
                *
                FROM
                todo
                WHERE 
                   category ='${category}';`;
        data = await db.all(getTodosQuery);
        response.send(data.map((eachTodo) => convertDBObject(eachTodo)));
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    /*search_q == todo */
    case hasTodoProperty(request.query):
      getTodosQuery = `
                SELECT
                *
                FROM
                todo
                WHERE 
                todo LIKE '%${search_q}%';`;
      data = await db.all(getTodosQuery);
      response.send(data.map((eachTodo) => convertDBObject(eachTodo)));
      break;
    default:
      getTodosQuery = `
            SELECT
              *
            FROM
              todo
            WHERE 
              todo;`;
      data = await db.all(getTodosQuery);
      response.send(data.map((eachTodo) => convertDBObject(eachTodo)));
  }
});

//API 2
//Returns a specific todo based on the todo ID
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
        SELECT
          *
        FROM
          todo
        WHERE
          id = ${todoId};`;

  const todo = await db.get(getTodoQuery);
  response.send(convertDBObject(todo));
});

//API 3
//GET Returns a list of all todos with a specific due date in the query parameter
app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  if (isMatch(date, "yyyy-MM-dd")) {
    const newDate = format(new Date(date), "yyyy-MM-dd");
    const getTodoQuery = `
        SELECT
          *
        FROM
          todo
        WHERE
          due_date = '${newDate}';`;
    const responseResult = await db.all(getTodoQuery);
    response.send(responseResult.map((eachTodo) => convertDBObject(eachTodo)));
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
});

//API 4
//POST Create a todo in the todo table,
app.post("/todos/", async (request, response) => {
  const { id, todo, status, priority, category, dueDate } = request.body;
  if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
    if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        if (isMatch(dueDate, "yyyy-MM-dd")) {
          const newDate = format(new Date(dueDate), "yyyy-MM-dd");
          const addTodoQuery = `
                        INSERT INTO 
                            todo(id, todo, priority, status, category, due_date)
                        VALUES( 
                            ${id},
                            '${todo}',
                            '${priority}',
                            '${status}',
                            '${category}',
                            '${newDate}');`;
          await db.run(addTodoQuery);
          response.send("Todo Successfully Added");
        } else {
          response.status(400);
          response.send("Invalid Due Date");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else {
    response.status(400);
    response.send("Invalid Todo Priority");
  }
});

let updatedColumn = "";
//API 4
//Updates the details of a specific todo based on the todo ID
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { todo, status, priority, category, dueDate } = request.body;
  let updateTodosQuery = "";
  switch (true) {
    case hasPriorityProperty(request.body):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        updateTodosQuery = `
                UPDATE todo
                SET
                    priority = '${priority}'
                WHERE
                    id = ${todoId};`;
        await db.run(updateTodosQuery);
        response.send("Priority Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;

    case hasStatusProperty(request.body):
      if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
        updateTodosQuery = `
            UPDATE todo
            SET
                status = '${status}'
            WHERE
                id = ${todoId};`;
        await db.run(updateTodosQuery);
        response.send("Status Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;

    case hasCategoryProperty(request.body):
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        updateTodosQuery = `
            UPDATE todo
            SET
                category = '${category}'
            WHERE
                id = ${todoId};`;
        await db.run(updateTodosQuery);
        response.send("Category Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    case request.body.dueDate !== undefined:
      if (isMatch(dueDate, "yyyy-MM-dd")) {
        const newDate = format(new Date(dueDate), "yyyy-MM-dd");
        console.log(newDate);
        updateTodosQuery = `
                UPDATE todo
                SET
                    due_date = '${newDate}'
                WHERE
                    id = ${todoId};`;
        await db.run(updateTodosQuery);
        response.send("Due Date Updated");
      } else {
        response.status(400);
        response.send("Invalid Due Date");
      }
      break;

    case request.body.todo !== undefined:
      updateTodosQuery = `
            UPDATE todo
            SET
                todo = '${todo}'
            WHERE
                id = ${todoId};`;
      await db.run(updateTodosQuery);
      response.send("Todo Updated");
      break;
  }
});

//API 5
//Deletes a todo from the todo table based on the todo ID
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
        DELETE FROM
            todo
        WHERE
           id = ${todoId};`;

  await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
