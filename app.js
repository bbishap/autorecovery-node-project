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
  const targetCPUUsage = 90; // Target CPU usage percentage
  const durationInSeconds = 300; // 5 minutes
  const interval = 2; // Check CPU usage every second

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
  function consumeMemory(targetPercentage = 0.9) {
    // Function to get the current memory usage in bytes
    function getMemoryUsage() {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      } else {
        throw new Error(
          "Memory information is not available in this environment."
        );
      }
    }

    // Function to allocate memory
    function allocateMemory(sizeInBytes) {
      const chunkSize = 1024 * 1024; // 1 MB chunks
      const chunks = Math.floor(sizeInBytes / chunkSize);
      const arrays = [];

      for (let i = 0; i < chunks; i++) {
        arrays.push(new Array(chunkSize).fill(0));
      }

      return arrays;
    }

    // Get the total available memory and calculate the target memory to use
    if (performance.memory) {
      const totalMemory = performance.memory.jsHeapSizeLimit;
      const targetMemory = totalMemory * targetPercentage;

      console.log(`Total memory: ${totalMemory / (1024 * 1024)} MB`);
      console.log(`Target memory: ${targetMemory / (1024 * 1024)} MB`);

      // Get the current memory usage
      const usedMemory = getMemoryUsage();
      const memoryToAllocate = targetMemory - usedMemory;

      console.log(`Memory to allocate: ${memoryToAllocate / (1024 * 1024)} MB`);

      // Allocate memory
      try {
        const allocatedMemory = allocateMemory(memoryToAllocate);
        console.log(
          `Allocated memory: ${
            (allocatedMemory.length * 1024 * 1024) / (1024 * 1024)
          } MB`
        );
      } catch (e) {
        console.error("Memory allocation failed:", e);
      }
    } else {
      console.error("Memory information is not available in this environment.");
    }
  }

  // Run the function to consume memory
  consumeMemory();
}
