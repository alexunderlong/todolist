import React, {useEffect} from 'react';
import Task from './Task';
import CreateTaskInput from "./CreateTask";
import {addTask, deleteTask, fetchTasks, toggleStatus} from "./tasksGateway"

class TasksList extends React.Component {
    state = {
        tasks: []
    }

    onCreate = (text) => {
        const newTask = {
            text,
            done: "false"
        };

        addTask(newTask).then(resp => {
                if (resp.ok) {
                    return fetchTasks()
                }
                throw new Error('Failed to create task')
            }).then(tasksList => {
                this.setState({
                    tasks: tasksList
                });
            })
    }

    componentDidMount() {
        fetchTasks()
            .then(tasksList => {
                this.setState({
                    tasks: tasksList
                });
            })
    }

    toggleTaskStatus = (taskId) => {
        const { done, text } = this.state.tasks.find(task => task.id===taskId)

        toggleStatus(text, done, taskId).then(resp => {
                if (resp.ok) {
                    return fetchTasks()
                }
                throw new Error('Failed to toggle task status')
            }).then(tasksList => {
                this.setState({tasks: tasksList})
            })
    }

    onDelete = taskId => {
        deleteTask(taskId).then(tasksList => {
                this.setState({
                    tasks: tasksList
                });
            })
    }

    render (){

        const sortedList = this.state.tasks
            .slice()
            .sort((a, b) => a.done - b.done)
        return (
            <div className="todo-list">
                <CreateTaskInput onCreate={this.onCreate}/>
                <ul className="list">
                    {sortedList.map(task =>
                        <Task key={task.id}
                              {...task}
                              onChange={this.toggleTaskStatus.bind(null, task.id)}
                              onDelete={this.onDelete.bind(null, task.id)}

                        />
                    )}
                </ul>
            </div>
        );
    }

}

export default TasksList;