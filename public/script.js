async function handleIncreaseCPUUsage() {
  try {
    const response = await fetch("/increaseCPU", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: "" }),
    });
    if (response.status === 200) {
      console.log("Button clicked!");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function handleIncreaseMemoryUsage() {
  try {
    const response = await fetch("/increaseMemory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: "" }),
    });
    if (response.status === 200) {
      console.log("Button clicked!");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
