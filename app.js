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
  function consumeMemory(targetPercentage = 0.7, durationMinutes = 10) {
    // Get total system memory in bytes
    const totalMemory = os.totalmem();

    // Calculate target memory to use
    const targetMemory = totalMemory * targetPercentage;

    // Log memory information
    console.log(
      `Total system memory: ${(totalMemory / (1024 * 1024)).toFixed(2)} MB`
    );
    console.log(
      `Target memory to use: ${(targetMemory / (1024 * 1024)).toFixed(2)} MB`
    );

    // Allocate memory in chunks
    const chunkSize = 10 * 1024 * 1024; // 10 MB chunks
    const arrays = [];
    let allocatedMemory = 0;

    try {
      while (allocatedMemory < targetMemory) {
        const arr = new Array(chunkSize).fill(0);
        arrays.push(arr);
        allocatedMemory += chunkSize;
        console.log(
          `Allocated ${(allocatedMemory / (1024 * 1024)).toFixed(2)} MB so far`
        );
      }
    } catch (e) {
      console.error("Memory allocation failed:", e);
    }

    console.log(
      "Memory allocation process completed. Holding memory for 10 minutes."
    );

    // Hold the allocated memory for the specified duration
    setTimeout(() => {
      console.log("Memory release started.");
      // Clear the allocated arrays
      arrays.length = 0;
      console.log("Memory released.");
    }, durationMinutes * 60 * 1000);
  }

  // Run the function to consume memory
  consumeMemory();
}
