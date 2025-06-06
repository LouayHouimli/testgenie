export async function fetchUserData(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}

export function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  return fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function calculateWithTimeout(numbers) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!Array.isArray(numbers)) {
        reject(new Error("Input must be an array"));
      }
      const sum = numbers.reduce((acc, num) => acc + num, 0);
      resolve(sum);
    }, 1000);
  });
}
