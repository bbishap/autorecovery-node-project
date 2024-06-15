document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("click", () => {
      showNotification(`${button.textContent.trim()} in progress`);
    });
  });
  updateCPUUsage();
  updateMemoryUsage();
  setInterval(updateCPUUsage, 3000);
  setInterval(updateMemoryUsage, 3000);
});

function showNotification(message) {
  const notificationContainer = document.getElementById(
    "notification-container"
  );
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("hide");
    notification.addEventListener("transitionend", () => notification.remove());
  }, 5000);
}

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

async function handleHostNotReporting() {
  try {
    const response = await fetch("/killHost", {
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

async function updateCPUUsage() {
  const cpuUsageElement = document.getElementById("cpu-usage");
  try {
    const response = await fetch("/cpu-usage");
    const data = await response.json();
    cpuUsageElement.textContent = `CPU Usage: ${data.cpuUsage}%`;
  } catch (error) {
    console.error("Error fetching CPU usage:", error);
    cpuUsageElement.textContent = "CPU Usage: Error";
  }
}

async function updateMemoryUsage() {
  const cpuUsageElement = document.getElementById("memory-usage");
  try {
    const response = await fetch("/memory-usage");
    const data = await response.json();
    cpuUsageElement.textContent = `Memory Usage: ${data.memoryUsage}%`;
  } catch (error) {
    console.error("Error fetching Memory usage:", error);
    cpuUsageElement.textContent = "Memory Usage: Error";
  }
}
