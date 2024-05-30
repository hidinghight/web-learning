<template>
  <div id="app">
    <div class="date-container">
      <div class="date-display">{{ currentDate }}</div>
    </div>
    <div class="todo-app">
      <div class="title">{{ title }}</div>

      <div class="todo-form">
        <input 
          class="todo-input" 
          type="text" 
          v-model="newTodo" 
          placeholder="Add a todo" 
          @keyup.enter="addTodo"
          @focus="toggleFocus(true)"
          @blur="toggleFocus(false)"
          :class="{ focused: inputFocused }"
        >
        <div @click="addTodo" class="todo-button">Add Todo</div>
      </div>

      <div 
        v-for="(todo, index) in todos" 
        :key="index" 
        :class="['item', { completed: todo.completed }]"
      >
        <div @click="editTodo(index)" v-if="editIndex !== index">
          <span class="name">{{ todo.name }}</span>
        </div>
        <input v-else type="text" v-model="todos[index].name" @keyup.enter="finishEdit(index)" @blur="finishEdit(index)" class="edit-input">
        <div class="del" @click="deleteTodo(index)">Del</div>
      </div>
    </div>
    <div class="countdown-container">
      <div class="countdown-display">
        <span 
          class="countdown-segment" 
          v-for="(segment, index) in countdownSegments" 
          :key="index" 
          @click="changeCountdownSegment(index)"
        >
          {{ segment }}
        </span>
      </div>
      <div class="countdown-controls">
        <div @click="startCountdown" :style="controlButtonStyle" class="control-button">Start</div>
        <div @click="pauseCountdown" :style="controlButtonStyle" class="control-button">Pause</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';

export default {
  name: 'App',
  setup() {
    const title = ref('Todo List');
    const newTodo = ref('');
    const todos = ref([]);
    const inputFocused = ref(false);
    const currentDate = ref(new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }));
    const countdownTime = ref('00:05:00');
    const countdownInterval = ref(null);
    const editIndex = ref(null);
    const countdownSegments = computed(() => countdownTime.value.split(':'));
    const editingSegmentIndex = ref(null);

    onMounted(() => {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        todos.value = JSON.parse(storedTodos);
      }

      setInterval(() => {
        currentDate.value = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false });
      }, 1000);
    });

    watch(todos, (newTodos) => {
      localStorage.setItem('todos', JSON.stringify(newTodos));
    }, { deep: true });

    const addTodo = () => {
      if (newTodo.value.trim() !== '') {
        todos.value.push({ name: newTodo.value, completed: false });
        newTodo.value = '';
      }
    };

    const deleteTodo = (index) => {
      todos.value.splice(index, 1);
    };

    const toggleFocus = (focused) => {
      inputFocused.value = focused;
    };

    const editTodo = (index) => {
      editIndex.value = index;
    };

    const finishEdit = (index) => {
      if (editIndex.value === index) {
        editIndex.value = null;
      }
    };

    const startCountdown = () => {
      if (countdownInterval.value) return;

      let [hours, minutes, seconds] = countdownTime.value.split(':').map(Number);
      countdownInterval.value = setInterval(() => {
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(countdownInterval.value);
          countdownInterval.value = null;
        }

        countdownTime.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }, 1000);
    };

    const pauseCountdown = () => {
      if (countdownInterval.value) {
        clearInterval(countdownInterval.value);
        countdownInterval.value = null;
      }
    };

    const changeCountdownSegment = (index) => {
      const segments = countdownSegments.value;
      let newValue = parseInt(segments[index]);
      newValue = newValue === 9 ? 0 : newValue + 1;
      segments[index] = String(newValue);
      countdownTime.value = segments.join(':');
    };

    const controlButtonStyle = computed(() => {
      return {
        color: countdownInterval.value ? '#333' : '#65FBD2'
      };
    });

    const editCountdownSegment = (index) => {
      editingSegmentIndex.value = index;
    };

    const saveEditedCountdownSegment = (newValue) => {
      const segments = countdownSegments.value;
      segments[editingSegmentIndex.value] = newValue;
      countdownTime.value = segments.join(':');
      editingSegmentIndex.value = null;
    };

    return {
      title,
      newTodo,
      todos,
      addTodo,
      deleteTodo,
      inputFocused,
      toggleFocus,
      currentDate,
      countdownTime,
      startCountdown,
      pauseCountdown,
      editTodo,
      finishEdit,
      editIndex,
      changeCountdownSegment,
      controlButtonStyle,
      countdownSegments,
      editingSegmentIndex,
      editCountdownSegment,
      saveEditedCountdownSegment
    };
  }
};
</script>
<style>
body {
  background: linear-gradient(to right, #e0e0e0, #f0f0f0);
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
}

.date-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 92%;
  margin-bottom: 80px;
}

.date-display {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px 40px;
  font-size: 32px;
  font-weight: 700;
  user-select: none;
  color: #333;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.todo-app {
  width: 400px;
  max-width: 90%;
  padding: 30px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
}

.title {
  user-select: none;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.todo-form {
  display: flex;
  margin-bottom: 20px;
  justify-content: center;
}

.todo-input {
  padding-left: 15px;
  border: 1px solid #ccc;
  outline: none;
  width: 70%;
  height: 50px;
  border-radius: 20px 0 0 20px;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.todo-input.focused {
  transform: scale(1.05);
  border-color: #333;
}

.todo-button {
  width: 100px;
  height: 50px;
  line-height: 50px;
  border-radius: 0 20px 20px 0;
  text-align: center;
  background: linear-gradient(to left, #888, #aaa);
  cursor: pointer;
  user-select: none;
  color: #333; /* Change button text color to black */
  transition: background 0.3s ease, color 0.3s ease; /* Add color transition */
}

.todo-button:hover {
  background: linear-gradient(to left, #666, #888);
  color: #fff; /* Change button text color to white */
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  margin: 8px 0;
  padding: 0 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.item:hover {
  background: rgba(245, 245, 245, 0.9);
  box-shadow: inset 2px 2px 8px rgba(0, 0, 0, 0.1);
}

.item.completed .name,
.item.completed .del {
  text-decoration: line-through;
  opacity: 0.6;
}

.del {
  color: #666;
  cursor: pointer;
  user-select: none;
  transition: color 0.3s ease;
}

.del:hover {
  color: red; /* Change color to red when hovered */
}

.countdown-container {
  margin-top: 80px;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.countdown-display {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.countdown-segment {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.triangle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 5px;
}

.triangle {
  width: 0;
  height: 0;
  border-style: solid;
  margin: 2px 0;
  cursor: pointer;
}

.triangle-up {
  border-width: 0 5px 7px 5px;
  border-color: transparent transparent #333333ae transparent;
}

.triangle-down {
  border-width: 7px 5px 0 5px;
  border-color: #333333ae transparent transparent transparent;
}

.countdown-controls {
  display: flex;
  gap: 10px;
}

.control-button {
  width: 60px;
  height: 30px;
  line-height: 30px;
  border-radius: 5px;
  text-align: center;
  background: linear-gradient(to left, #888, #aaa);
  cursor: pointer;
  user-select: none;
  color: #333; /* Change button text color to black */
  transition: background 0.3s ease, color 0.3s ease; /* Add color transition */
}

.control-button:hover {
  background: linear-gradient(to left, #666, #888);
  color: #65FBD2; /* Change button text color to blue on hover */
}

.control-button.active {
  color: #65FBD2; /* Maintain blue color when active */
}
</style>

