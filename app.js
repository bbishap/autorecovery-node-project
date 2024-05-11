const express = require("express");
const app = express();
const os = require("os");
const pidusage = require("pidusage");

// Define the port to listen on
const port = process.env.PORT || 3000;

// Serve static files from the `public` directory
app.use(express.static("public"));

// Route to handle requests to the root path
app.get("/", (req, res) => {
  // Render the index.html file
  res.sendFile("index.html", { root: "public" });
});

app.post("/increaseCPU", (req, res) => {
  console.log("CPU Button clicked!");
  res.sendStatus(200);
  increaseCPUUsage();
});

app.post("/increaseMemory", (req, res) => {
  console.log("Button clicked!");
  res.sendStatus(200);
  increaseMemoryUsage();
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});

function increaseCPUUsage() {
  // Adjust these parameters as needed
  const targetCPUUsage = 70; // Target CPU usage percentage
  const durationInSeconds = 300; // 5 minutes
  const interval = 10; // Check CPU usage every second

  let startTime;

  function increaseCPUUsage() {
    let result = 0;
    let looplimit = 600000000; //change this to increase or decrease cpu usage
    for (let i = 0; i < looplimit; i++) {
      result += Math.sqrt(i);
    }
    return result;
  }

  function checkAndAdjustWorkload() {
    pidusage(process.pid, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }

      const currentCPUUsage = stats.cpu;

      console.log(`Current CPU Usage: ${currentCPUUsage.toFixed(2)}%`);

      if (currentCPUUsage < targetCPUUsage) {
        increaseCPUUsage();
      }

      if (Date.now() - startTime < durationInSeconds * 1000) {
        setTimeout(checkAndAdjustWorkload, interval);
      }
    });
  }

  function startWorkload() {
    startTime = Date.now();
    checkAndAdjustWorkload();
  }

  startWorkload();
}

function increaseMemoryUsage() {
  const duration = 5 * 60 * 1000; // 5 minutes in milliseconds

  let memoryHog = [];

  function getTotalMemory() {
    return os.totalmem();
  }

  function getAvailableMemory() {
    return os.freemem();
  }

  function increaseMemUsage() {
    const targetMemoryUsage = 0.8 * getTotalMemory(); // 80% of total memory
    const chunkSize = 100 * 1024 * 1024; // 100MB

    while (
      getAvailableMemory() >
      targetMemoryUsage - memoryHog.length * chunkSize
    ) {
      memoryHog.push(new Array(chunkSize).fill(0));
    }

    console.log(
      `Allocated ${
        (memoryHog.length * chunkSize) / (1024 * 1024)
      } MB (${Math.round(
        ((memoryHog.length * chunkSize) / getTotalMemory()) * 100
      )}% of total memory)`
    );
  }

  function runMemoryHog() {
    increaseMemUsage();

    const endTime = Date.now() + duration;
    const interval = setInterval(() => {
      if (Date.now() >= endTime) {
        clearInterval(interval);
        console.log("Memory hog process completed.");
      } else {
        console.log(
          `Memory hog running... (${Math.floor(
            (endTime - Date.now()) / 1000
          )} seconds remaining)`
        );
      }
    }, 1000);
  }

  runMemoryHog();
}
