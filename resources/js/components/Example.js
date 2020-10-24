import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      newTaskModal:false,
      newTaskData: {
        name: "",
        description: ""
      },
      editTaskModal: false,
      editTaskData: {
        id: "",
        name:"",
        description: ""
      },
      isClicked: false,
    };
    this.addTask = this.addTask.bind(this);
    this.toggleEditTaskModal = this.toggleEditTaskModal.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.handleNewTaskName = this.handleNewTaskName.bind(this);
    this.handleNewTaskDescription = this.handleNewTaskDescription.bind(this);
    this.handleEditTaskName = this.handleEditTaskName.bind(this);
    this.handleEditTaskDescription = this.handleEditTaskDescription.bind(this);
    this.handleAttributeOfButton = this.handleAttributeOfButton.bind(this);
  }

  loadTask() {
    axios.get('http://127.0.0.1:8009/api/tasks').then(( response ) => {
      this.setState({
        tasks: response.data
      });
    });
  }

  addTask() {
    axios.post('http://127.0.0.1:8009/api/task', this.state.newTaskData).then(( response ) => {
      let { tasks } = this.state;
      this.loadTask();

      this.setState({
        tasks,
        newTaskModal: false,
        newTaskData: {
          name: this.state.newTaskData.name,
          description: this.state.newTaskData.description
        },
      });
    });
  }

  componentDidMount() {
    this.loadTask();
  }

  toggleNewTaskModal() {
    this.setState({
      newTaskModal: !this.state.newTaskModal
    })
  }

  toggleEditTaskModal() {
    this.setState({
      editTaskModal: !this.state.editTaskModal,
    });
  }

  handleAttributeOfButton () {
    this.setState({
      isClicked: true
    });
    setTimeout(this.setState({isClicked: false}), 5000);
  }

  handleNewTaskName (e) {
    let { newTaskData } = this.state;
    newTaskData.name = e.target.value;
    this.setState({
      newTaskData
    });
  }

  handleNewTaskDescription (e) {
    let { newTaskData } = this.state;
    newTaskData.description = e.target.value;
    this.setState({newTaskData});
  }

  editTask(id, name, description) {
    this.setState({
      editTaskData: {
        id,
        name,
        description,
      },
      editTaskModal: !this.state.editTaskModal
    });
  }

  handleEditTaskName (e) {
    let { editTaskData } = this.state;
    editTaskData.name = e.target.value;
    this.setState({
      editTaskData
    });
  }

  handleEditTaskDescription (e) {
    let { editTaskData } = this.state;
    editTaskData.description = e.target.value;
    this.setState({
      editTaskData
    });
  }

  updateTask() {
    const { name, description } = this.state.editTaskData;

    axios.put('http://127.0.0.1:8009/api/task/'+this.state.editTaskData.id, {
      name,
      description
    }).then((response) => {
      this.loadTask();

      this.setState({
        editTaskModal: false,
        editTaskData: {
          id:"",
          name: "",
          description: ""
        }
      });
    });
  }

  deleteTask(id) {
    axios.delete('http://127.0.0.1:8009/api/task/'+id).then((response) => {
      this.loadTask();
    });
  }

  render() {
    const { newTaskModal, name, description, editTaskModal, isClicked } = this.state;
    let tasks = this.state.tasks.map((task) => {
      return (
        <tr key={task.id}>
          <td>{task.id}</td>
          <td>{task.name}</td>
          <td>{task.description}</td>
          <td>
            <Button
              color="success"
              size="sm"
              className="mr-2" 
              onClick={this.editTask.bind(this, task.id, task.name, task.description)}
            >Edit</Button>
            <Button color="danger" size="sm" onClick={this.deleteTask.bind(this, task.id)}>Delete</Button>
          </td>
        </tr>
      );
    });

    return (
      <div className="App container">
        <Button color="primary" onClick={this.toggleNewTaskModal.bind(this)} className="my-3">Add Task</Button>
        <Modal isOpen={newTaskModal} toggle={this.toggleNewTaskModal.bind(this)}>
          <ModalHeader toggle={this.toggleNewTaskModal.bind(this)}>Modal title</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input 
                name="name"
                value={name}
                onChange={this.handleNewTaskName}
              >{name}</Input>
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                name="description"
                value={description}
                onChange={this.handleNewTaskDescription}
              >{description}</Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" disabled={isClicked} onClick={this.addTask}>Add Task</Button>
            <Button color="secondary" onClick={this.toggleNewTaskModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={editTaskModal} toggle={this.toggleEditTaskModal.bind(this)}>
          <ModalHeader toggle={this.toggleEditTaskModal.bind(this)}>Modal title</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input 
                name="name"
                value={name}
                onChange={this.handleEditTaskName}
              >{name}</Input>
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                name="description"
                value={description}
                onChange={this.handleEditTaskDescription}
              >{description}</Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" disabled={isClicked} onClick={this.updateTask}>Update Task</Button>
            <Button color="secondary" onClick={this.toggleEditTaskModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
        
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks}
          </tbody>
        </Table>
      </div>
    );
  }
}

ReactDOM.render(
  <Example />,
  document.getElementById('example')
);
