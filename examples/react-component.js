import React, { useState, useEffect } from "react";

export const Counter = ({ initialValue = 0, onCountChange }) => {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    onCountChange?.(count);
  }, [count, onCountChange]);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(initialValue);

  return (
    <div role="main" aria-label="Counter widget">
      <h1>Counter: {count}</h1>
      <button
        onClick={increment}
        aria-label="Increment counter"
        data-testid="increment-btn"
      >
        +
      </button>
      <button
        onClick={decrement}
        aria-label="Decrement counter"
        data-testid="decrement-btn"
      >
        -
      </button>
      <button
        onClick={reset}
        aria-label="Reset counter"
        data-testid="reset-btn"
      >
        Reset
      </button>
    </div>
  );
};

export const UserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and email are required");
      return;
    }
    onSubmit?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="form"
      aria-label="User registration form"
    >
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          required
          aria-describedby="name-help"
        />
        <span id="name-help">Enter your full name</span>
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          aria-describedby="email-help"
        />
        <span id="email-help">Enter a valid email address</span>
      </div>

      <div>
        <label htmlFor="age">Age:</label>
        <input
          id="age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleInputChange}
          min="0"
          max="120"
        />
      </div>

      <button type="submit" aria-label="Submit form">
        Submit
      </button>
    </form>
  );
};
