# Passing Data Between Components

In React, data flows in a single direction: from parent to child via props. Props are read-only — a child receives values from its parent but cannot directly change the parent's data.

Example: `App.jsx` (parent) can send data to `Card.jsx` (child) using props, but the child cannot directly modify or send data back to the parent by changing props.

If the child needs to communicate upward (child → parent), the parent can pass a callback (function) down as a prop. The child calls that function to send data back to the parent.

## Simple example

```jsx
// Parent (App.jsx)
function App() {
  const handleChildData = (value) => {
    console.log('Received from child:', value);
  };

  return <Card title="Karan Patel" onNotify={handleChildData} />;
}

// Child (Card.jsx)
function Card({ title, onNotify }) {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={() => onNotify('Hello from Card')}>Notify Parent</button>
    </div>
  );
}
```

## Summary

- Props: parent → child (read-only)
- Child → parent: use callbacks (or context/state management solutions) to pass information upward.

This pattern keeps component data flow predictable and helps maintain a clear separation of concerns.
