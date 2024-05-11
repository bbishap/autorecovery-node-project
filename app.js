const express = require("express");
const app = express();
const os = require("os");
const pidusage = require("pidusage");
const osUtils = require("os-utils");

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
  // Function to calculate memory usage in percentage
  function calculateMemoryUsage() {
    return new Promise((resolve, reject) => {
      osUtils.totalmem((err, totalMem) => {
        if (err) {
          reject(err);
        } else {
          osUtils.freemem((err, freeMem) => {
            if (err) {
              reject(err);
            } else {
              const usedMem = totalMem - freeMem;
              const memUsagePercentage = (usedMem / totalMem) * 100;
              resolve(memUsagePercentage);
            }
          });
        }
      });
    });
  }

  // Function to consume memory until reaching the desired percentage for a specific duration
  async function consumeMemory(targetPercentage, durationMinutes) {
    const intervalMs = 100; // Adjust this based on how quickly you want to consume memory
    const targetUsageBytes = os.totalmem() * (targetPercentage / 100);
    const buffer = [];
    const startTime = Date.now();
    let elapsedTime = 0;

    console.log(
      `Attempting to reach ${targetPercentage}% memory usage for ${durationMinutes} minutes...`
    );

    while (elapsedTime < durationMinutes * 60 * 1000) {
      buffer.push(Buffer.alloc(10 * 1024 * 1024)); // Allocate 10MB buffer
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      elapsedTime = Date.now() - startTime;
    }

    console.log(
      `Memory usage reached ${targetPercentage}% for ${durationMinutes} minutes.`
    );
  }

  // Main function
  async function main() {
    const targetPercentage = 80;
    const durationMinutes = 5;

    try {
      await consumeMemory(targetPercentage, durationMinutes);
    } catch (err) {
      console.error("Error:", err);
    }
  }

  main();
}
