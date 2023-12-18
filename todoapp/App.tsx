import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
}

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchAllTasks = async () => {
    try {
      const response = await axios.get('http://192.168.84.170:8000/task/alltasks');
      const fetchedTasks = response.data;
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const addTask = async () => {
    try {
      if (!task.trim()) {
        console.warn('Task cannot be empty!');
        return;
      }

      const response = await axios.post('http://192.168.84.170:8000/task/addtask', {
        title: task,
      });
      const newTask = response.data;
      setTasks([...tasks, newTask]);
      setTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEdit = (taskId: number) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setSelectedTask(taskToEdit);
      setNewTaskTitle(taskToEdit.title); 
      setModalVisible(true);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete(`http://192.168.84.170:8000/task/deletetask/${taskId}`);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  

  const handleModalClose = () => {
    setSelectedTask(null);
    setModalVisible(false);
  };

  const handleSaveEdit = () => {
    const updatedTasks = tasks.map((t) =>
      t.id === selectedTask?.id ? { ...t, title: newTaskTitle } : t
    );
    setTasks(updatedTasks);
    handleModalClose();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.content}>
          <Text style={styles.title}>To-Do App</Text>
          <TextInput
            style={styles.input}
            placeholder="Add a task"
            value={task}
            onChangeText={(text) => setTask(text)}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.buttonText}>Add Task</Text>
          </TouchableOpacity>

          <View style={styles.taskList}>
            {tasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <Text style={styles.taskText}>{task.title}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleEdit(task.id)}>
                    <Text style={styles.icon}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteTask(task.id)}>
                    <Text style={styles.icon}>🗑️</Text>
                  </TouchableOpacity>

                </View>
              </View>
            ))}
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={handleModalClose}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Task</Text>
              <TextInput
                style={styles.modalInput}
                value={newTaskTitle} 
                onChangeText={(text) => setNewTaskTitle(text)}
              />
              <View style={styles.modalButtonContainer}>
                <Pressable
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={handleModalClose}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: 'purple',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskList: {
    marginTop: 20,
  },
  taskItem: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
    fontSize: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 12,
    borderRadius: 4,
    width: '48%',
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: 'gray',
  },
  modalSaveButton: {
    backgroundColor: 'purple',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
