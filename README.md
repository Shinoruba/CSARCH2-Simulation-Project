# Cache Simulator (Full Associative / MRU)
### CSARCH2 S13 - Group 4
- Chan, Rizza
- Homssi, Yazan
- Valenzuela, Shanley

## Overview
This project is a web-based simulation of a cache memory system using a full associative cache with the Most Recently Used (MRU) replacement policy. It allows users to input various parameters and simulate the cache behavior, providing outputs such as cache hits, cache misses, miss penalty, average memory access time, total memory access time, and a snapshot of the cache memory.

## Features
- Input parameters: block size, main memory size, cache memory size, program flow, cache access time, and memory access time.
- Output results: number of cache hits, number of cache misses, miss penalty, average memory access time, total memory access time, and cache memory snapshot.
#### Option to download the results in a text file.


## Usage
- Open index.html in a web browser.
- Fill in the input fields with the appropriate values:
  - Block Size (in words)
  - Main Memory Size (select blocks or words)
  - Cache Memory Size (select blocks or words)
  - Program Flow (comma-separated values, select blocks or words)
  - Cache Access Time (in nanoseconds)
  - Memory Access Time (in nanoseconds)
- Click the "Simulate" button to run the simulation.
- View the results in the output section.
- Click the "Download Results" button to save the results as a text file.

## Input Fields
- Block Size: Size of each block in words.
- Main Memory Size: Total size of the main memory (select blocks or words).
- Cache Memory Size: Total size of the cache memory (select blocks or words).
- Program Flow: Sequence of memory accesses to be simulated (comma-separated values, select blocks or words).
- Cache Access Time: Time taken to access the cache memory (in nanoseconds).
- Memory Access Time: Time taken to access the main memory (in nanoseconds).

## Output
- Number of Cache Hits: The number of times the requested data was found in the cache.
- Number of Cache Misses: The number of times the requested data was not found in the cache.
- Miss Penalty: The additional time required to retrieve data from the main memory when a cache miss occurs.
- Average Memory Access Time: The average time taken to access memory, considering both cache hits and misses.
- Total Memory Access Time: The total time taken to access memory for all requests.
- Cache Memory Snapshot: A snapshot of the current state of the cache memory.

## Screenshots ( To be Updated )

later pls

## Files
- index.html: The main HTML file for the web interface.
- styles.css: The CSS file for styling the web interface.
- script.js: The JavaScript file containing the simulation logic and interactivity.
  
## How it Works
The simulation logic is implemented in script.js, which handles the following:
1. Parsing and validating user inputs.
2. Simulating the cache behavior based on the provided inputs.
3. Calculating the results and updating the output section.
4. Providing an option to download the results as a text file.
