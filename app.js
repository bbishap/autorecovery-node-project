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

app.get("/cpu-usage", (req, res) => {
  osUtils.cpuUsage((v) => {
    res.json({ cpuUsage: (v * 100).toFixed(2) }); // Convert to percentage and round to 2 decimal places
  });
});

app.get("/memory-usage", (req, res) => {
  const freeMem = osUtils.freememPercentage() * 100;
  console.log(freeMem, "free");
  const usedMemPercentage = (100 - freeMem).toFixed(2);
  res.json({ memoryUsage: usedMemPercentage });
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

app.post("/killHost", (req, res) => {
  console.log("Button clicked!");
  res.sendStatus(200);
  killHost();
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
    let looplimit = 800000000; //change this to increase or decrease cpu usage
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
  function consumeMemory(targetMB = 350, durationMinutes = 10) {
    // Convert target memory from MB to bytes
    const targetMemory = targetMB * 1024 * 1024;
    const chunkSize = 1 * 1024 * 1024; // 1 MB chunks
    const arrays = [];
    let allocatedMemory = 0;

    console.log(`Target memory to use: ${targetMB} MB`);

    function allocateMemory() {
      try {
        const arr = new Array(chunkSize).fill(0);
        arrays.push(arr);
        allocatedMemory += chunkSize;
        console.log(
          `Allocated: ${(allocatedMemory / (1024 * 1024)).toFixed(2)} MB`
        );
      } catch (e) {
        console.error("Memory allocation failed:", e);
      }
    }

    function releaseMemory() {
      if (arrays.length > 0) {
        arrays.pop();
        allocatedMemory -= chunkSize;
        console.log(
          `Released: ${(allocatedMemory / (1024 * 1024)).toFixed(2)} MB`
        );
      }
    }

    const checkInterval = setInterval(() => {
      const usedMemory = process.memoryUsage().heapUsed;

      console.log(
        `Current memory usage: ${(usedMemory / (1024 * 1024)).toFixed(2)} MB`
      );

      if (usedMemory < targetMemory) {
        allocateMemory();
      } else if (usedMemory > targetMemory) {
        releaseMemory();
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(checkInterval);
      arrays.length = 0; // Release all memory
      console.log("Memory consumption period ended. All memory released.");
    }, durationMinutes * 60 * 1000);
  }

  // Run the function to consume memory
  consumeMemory();
}

function killHost() {
  function makeServerUnresponsive() {
    const os = require("os");

    // Function to consume memory
    function consumeMemory(targetMB = 900) {
      const targetMemory = targetMB * 1024 * 1024; // Convert MB to bytes
      const chunkSize = 10 * 1024 * 1024; // 10 MB chunks
      const arrays = [];
      let allocatedMemory = 0;

      console.log(`Target memory to use: ${targetMB} MB`);

      function allocateMemory() {
        try {
          const arr = new Array(chunkSize).fill(0);
          arrays.push(arr);
          allocatedMemory += chunkSize;
          console.log(
            `Allocated: ${(allocatedMemory / (1024 * 1024)).toFixed(2)} MB`
          );
        } catch (e) {
          console.error("Memory allocation failed:", e);
        }
      }

      // Allocate memory in chunks until the target memory is reached
      while (allocatedMemory < targetMemory && os.freemem() > chunkSize) {
        allocateMemory();
      }

      console.log(
        `Finished allocating memory: ${allocatedMemory / (1024 * 1024)} MB`
      );
    }

    // Function to consume CPU
    function consumeCPU() {
      console.log("Starting CPU consumption...");

      // Perform intensive computations in an infinite loop
      while (true) {
        // This loop will keep the CPU busy
        for (let i = 0; i < 1e8; i++) {
          Math.sqrt(i);
        }
      }
    }

    // Start memory consumption
    consumeMemory();

    // Start CPU consumption
    consumeCPU();
  }

  // Call the function to simulate high resource usage
  makeServerUnresponsive();
}
