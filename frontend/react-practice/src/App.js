import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log('Effect ran!');
    
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup function (runs when component unmounts)
    return () => {
      console.log('Cleaning up timer');
      clearInterval(interval);
    };
  }, []); // Empty array = run ONCE on mount

  return (
    <div>
      <h2>Timer: {seconds} seconds</h2>
    </div>
  );
}

function App() {
  const [showTimer, setShowTimer] = useState(true);

  return (
    <div className="App" style={{ padding: '20px' }}>
      <button onClick={() => setShowTimer(!showTimer)}>
        {showTimer ? 'Hide' : 'Show'} Timer
      </button>
      {showTimer && <Timer />}
    </div>
  );
}

export default App;


// Todo list (add and delete, api call simulation)
// import { useState } from 'react';

// function TodoApp() {
//   const [todos, setTodos] = useState([]);
//   const [inputValue, setInputValue] = useState('');
//   const [nextId, setNextId] = useState(1);

//   const addTodo = () => {
//     if (inputValue.trim() === '') return; // Don't add empty todos

//     const newTodo = {
//       id: nextId,
//       text: inputValue,
//       completed: false
//     };

//     setTodos([...todos, newTodo]);  // Add to array
//     setInputValue('');               // Clear input
//     setNextId(nextId + 1);          // Increment ID
//   };

//   const deleteTodo = (id) => {
//     setTodos(todos.filter(todo => todo.id !== id));
//   };

//   const toggleTodo = (id) => {
//     setTodos(todos.map(todo => 
//       todo.id === id 
//         ? { ...todo, completed: !todo.completed }
//         : todo
//     ));
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
//       <h1>Todo List</h1>
      
//       <div style={{ marginBottom: '20px' }}>
//         <input 
//           type="text"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && addTodo()}
//           placeholder="Add a todo..."
//           style={{ padding: '10px', width: '70%' }}
//         />
//         <button onClick={addTodo} style={{ padding: '10px', marginLeft: '10px' }}>
//           Add
//         </button>
//       </div>

//       <div>
//         {todos.length === 0 ? (
//           <p style={{ color: '#999' }}>No todos yet. Add one above!</p>
//         ) : (
//           todos.map(todo => (
//             <div 
//               key={todo.id}
//               style={{ 
//                 padding: '10px',
//                 margin: '5px 0',
//                 border: '1px solid #ddd',
//                 borderRadius: '5px',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center'
//               }}
//             >
//               <span 
//                 onClick={() => toggleTodo(todo.id)}
//                 style={{ 
//                   textDecoration: todo.completed ? 'line-through' : 'none',
//                   cursor: 'pointer',
//                   flex: 1
//                 }}
//               >
//                 {todo.text}
//               </span>
//               <button 
//                 onClick={() => deleteTodo(todo.id)}
//                 style={{ 
//                   background: '#ff4444', 
//                   color: 'white',
//                   border: 'none',
//                   padding: '5px 10px',
//                   borderRadius: '3px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 Delete
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       <p style={{ marginTop: '20px', color: '#666' }}>
//         Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}
//       </p>
//     </div>
//   );
// }

// function App() {
//   return <TodoApp />;
// }

// export default App;


// import { useState } from 'react';

// // Lists and Keys
// function SessionList() {
//   // Array of session (State)
//   const [sessions, setSessions] = useState([
//     { id: 1, date: '2024-12-17', duration: '45', instrument: 'Piano' },
//     { id: 2, date: '2024-12-16', duration: '30', instrument: 'Guitar' },
//     { id: 3, date: '2024-12-15', duration: '60', instrument: 'Piano' }
//   ]);

//   return (
//     <div>
//       <h2>My Practice Sessions</h2>
//       {sessions.map((session) => (
//         <div 
//           key={session.id}  // IMPORTANT: unique key for each item
//           style={{ 
//             border: '1px solid #ccc', 
//             padding: '15px', 
//             margin: '10px',
//             borderRadius: '5px'
//           }}
//         >
//           <h3>{session.date}</h3>
//           <p>Duration: {session.duration} minutes</p>
//           <p>Instrument: {session.instrument}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// function App() {
//   return (
//     <div className="App">
//       <SessionList />
//     </div>
//   );
// }

// export default App;


// More complex use state
// import { useState } from 'react';

// function PracticeTracker() {
//   const [totalMinutes, setTotalMinutes] = useState(0);
//   const [sessionMinutes, setSessionMinutes] = useState(0);

//   const addSession = () => {
//     if (sessionMinutes > 0) {
//       setTotalMinutes(totalMinutes + sessionMinutes);
//       setSessionMinutes(0); // Reset input
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Practice Time Tracker</h2>
      
//       <div>
//         <h3>Total Practice Time: {totalMinutes} minutes</h3>
//         <p>That's {Math.floor(totalMinutes / 60)} hours and {totalMinutes % 60} minutes!</p>
//       </div>

//       <div style={{ marginTop: '20px' }}>
//         <input 
//           type="number" 
//           value={sessionMinutes}
//           onChange={(e) => setSessionMinutes(Number(e.target.value))}
//           placeholder="Minutes practiced"
//         />
//         <button onClick={addSession}>Add Session</button>
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <div className="App">
//       <PracticeTracker />
//     </div>
//   );
// }

// export default App;

// /** Use state */
// import { useState } from 'react';

// function Counter() {
//   // useState returns [currentValue, functionToUpdateIt]
//   const [count, setCount] = useState(0);
//   //     ↑         ↑              ↑
//   //  current   updater    initial value
//   //   value    function

//   return (
//     <div>
//       <h2>Counter: {count} </h2>
//       <button onClick={() => setCount(count+1)}>
//         Increment
//       </button>
//       <button onClick={() => setCount(count-1)}>
//         Decrement
//       </button>
//       <button onClick={() => setCount(0)}>
//         Reset
//       </button>
//     </div>
//   );
// }

// function App() {
//   return (
//     <div className="App"> 
//       <h1>Counter Example</h1>
//       <Counter />
//     </div>
//   );
// }

// export default App;

/** Props */
// function SessionCard( {date, duration, instrument} ) {
//   return (
//     <div style={{
//       border: '1px solid #ccc',
//       padding: '20px',
//       margin: '10px',
//       borderRadius: '8px'
//     }}>

//       <h3> {date} </h3>
//       <p>Duration: {duration}</p>
//       <p>Instrument: {instrument}</p>

//     </div>

//   );
// }

// function App() {
//   return (
//     <div className="App">
//       <h1>My Practice Sessions</h1>
      
//       <SessionCard 
//         date="2024-12-17" 
//         duration={45} 
//         instrument="Piano" 
//       />
      
//       <SessionCard 
//         date="2024-12-16" 
//         duration={30} 
//         instrument="Guitar" 
//       />
      
//       <SessionCard 
//         date="2024-12-15" 
//         duration={60} 
//         instrument="Piano" 
//       />
//     </div>
//   );
// }

// export default App;