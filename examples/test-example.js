export function calculateTax(amount, rate) {
  if (amount < 0) {
    throw new Error("Amount cannot be negative");
  }
  return amount * rate;
}

const formatCurrency = (value, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(value);
};

async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

export { formatCurrency };
export default fetchUser;

export function testFunction() {
  return "hello world";
}
export function addTask(task) {
  return task;
}
