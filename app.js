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
app.listen(port, () => {
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
  function increaseMemoryContinuous(bufferSizeInBytes, durationInSeconds) {
    const endTime = Date.now() + durationInSeconds * 1000;
    const buffer = Buffer.alloc(bufferSizeInBytes, 0);

    function fillBuffer() {
      if (Date.now() < endTime) {
        buffer.fill(0); // Fill the buffer with zeros (adjust as needed)
        // Introduce a delay (e.g., 10 milliseconds) before the next iteration
        setTimeout(fillBuffer, 10);
      }
    }

    // Start the continuous memory usage
    fillBuffer();
  }

  // Adjust these parameters as needed
  const bufferSizeInBytes = 1024 * 1024 * 1024; // 1GB
  const durationInSeconds = 180; // 3 minutes

  // Call the function to continuously use 1GB of memory with a delay
  increaseMemoryContinuous(bufferSizeInBytes, durationInSeconds);
}
