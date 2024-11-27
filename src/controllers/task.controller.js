import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/task.model.js";

const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, startTime, endTime, priority, status } = req.body;

    if (!title || !startTime || !endTime || !priority || !status) {
      throw new ApiError(
        400,
        "All fields are required: _id, title, startTime, endTime, priority, and status."
      );
    }

    if (priority < 1 || priority > 5) {
      throw new ApiError(400, "Priority must be between 1 and 5.");
    }

    const validStatuses = ["pending", "finished"];
    if (!validStatuses.includes(status)) {
      throw new ApiError(
        400,
        `Status must be one of the following: ${validStatuses.join(", ")}.`
      );
    }

    if (new Date(startTime) >= new Date(endTime)) {
      throw new ApiError(400, "Start time must be earlier than end time.");
    }

    const userId = req.user?._id;

    const newTask = new Task({
      userId,
      title,
      startTime,
      endTime,
      priority,
      status,
    });

    await newTask.save();

    return res
      .status(201)
      .json(new ApiResponse(200, newTask, "Task created successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const getTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    const { status, priority, startDate, endDate } = req.query;

    const query = { userId };

    if (status) {
      const validStatuses = ["pending", "finished"];
      if (!validStatuses.includes(status)) {
        throw new ApiError(
          400,
          `Invalid status. Valid statuses are: ${validStatuses.join(", ")}.`
        );
      }
      query.status = status;
    }

    if (priority) {
      const priorityValue = parseInt(priority);
      if (priorityValue < 1 || priorityValue > 5) {
        throw new ApiError(400, "Priority must be between 1 and 5.");
      }
      query.priority = priorityValue;
    }

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) {
        query.startTime.$gte = new Date(startDate);
      }
      if (endDate) {
        query.startTime.$lte = new Date(endDate);
      }
    }

    const tasks = await Task.find(query).sort({ startTime: 1 });

    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          "Something Went Wrong While Fetching Tasks",
          error.message
        )
      );
  }
});

const updateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const { taskId } = req.params;
    const { title, startTime, endTime, priority, status } = req.body;

    if (!taskId) {
      throw new ApiError(400, "Task ID is required to update a task.");
    }

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      throw new ApiError(404, "Task not found or does not belong to the user.");
    }

    if (title) {
      task.title = title.trim();
    }

    if (startTime || endTime) {
      if (startTime) {
        task.startTime = new Date(startTime);
      }
      if (endTime) {
        task.endTime = new Date(endTime);
      }

      if (task.startTime >= task.endTime) {
        throw new ApiError(400, "Start time must be earlier than end time.");
      }
    }

    if (priority) {
      const priorityValue = parseInt(priority, 10);
      if (priorityValue < 1 || priorityValue > 5) {
        throw new ApiError(400, "Priority must be between 1 and 5.");
      }
      task.priority = priorityValue;
    }

    if (status) {
      const validStatuses = ["pending", "finished"];
      if (!validStatuses.includes(status)) {
        throw new ApiError(
          400,
          `Invalid status. Valid statuses are: ${validStatuses.join(", ")}.`
        );
      }
      task.status = status;
    }

    await task.save();

    return res
      .status(200)
      .json(new ApiResponse(200, task, "Task updated successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const deleteTask = asyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      throw new ApiError(400, "Task ID is required for deletion.");
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      throw new ApiError(404, "Task not found. Deletion failed.");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, deletedTask, "Task deleted successfully."));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const deleteMultipleTasks = asyncHandler(async (req, res) => {
  try {
    const { taskIds } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      throw new ApiError(400, "An array of task IDs is required for deletion.");
    }

    const result = await Task.deleteMany({ _id: { $in: taskIds } });

    if (result.deletedCount === 0) {
      throw new ApiError(404, "No tasks found with the provided IDs.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { deletedCount: result.deletedCount },
          `${result.deletedCount} task(s) deleted successfully.`
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          "Something Went Wrong While Deleteing Tasks",
          error.message
        )
      );
  }
});

export { createTask, getTasks, updateTask, deleteTask, deleteMultipleTasks };
