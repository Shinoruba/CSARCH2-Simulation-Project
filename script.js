document.addEventListener('DOMContentLoaded', function() 
{
    const simulateButton = document.getElementById('simulate');
    const downloadButton = document.getElementById('downloadResults');

    simulateButton.addEventListener('click', runSimulation);
    downloadButton.addEventListener('click', downloadResults);
});

function runSimulation() 
{
    const blockSize = parseInt(document.getElementById('blockSize').value);
    const mmSize = parseInt(document.getElementById('mmSize').value);
    const mmSizeUnit = document.getElementById('mmSizeUnit').value;
    const cacheSize = parseInt(document.getElementById('cacheSize').value);
    const cacheSizeUnit = document.getElementById('cacheSizeUnit').value;
    const programFlow = document.getElementById('programFlow').value.split(',').map(Number);
    const programFlowUnit = document.getElementById('programFlowUnit').value;
    const cacheAccessTime = parseFloat(document.getElementById('cacheAccessTime').value);
    const memoryAccessTime = parseFloat(document.getElementById('memoryAccessTime').value);

    const results = simulateCache(blockSize, mmSize, mmSizeUnit, cacheSize, cacheSizeUnit, programFlow, programFlowUnit, cacheAccessTime, memoryAccessTime);

    // Display results here
    document.getElementById('cacheHits').textContent = results.cacheHits;
    document.getElementById('cacheMisses').textContent = results.cacheMisses;
    document.getElementById('missPenalty').textContent = results.missPenalty.toFixed(2);
    document.getElementById('avgAccessTime').textContent = results.avgAccessTime.toFixed(2);
    document.getElementById('totalAccessTime').textContent = results.totalAccessTime.toFixed(2);
    document.getElementById('cacheSnapshot').innerHTML = results.cacheSnapshot;

    // [NEW FEATURE] This will display simulation steps and memory access sequence skibidi toilet
    const stepsContainer = document.getElementById('simulationProcess');
    stepsContainer.innerHTML = '';
    
    const sequenceTable = document.createElement('table');
    sequenceTable.innerHTML = `
        <tr>
            <th>Seq</th>
            <th>Hit</th>
            <th>Miss</th>
            <th>Block</th>
        </tr>
    `;
    
    results.memoryAccessSequence.forEach((access) => {
        const row = sequenceTable.insertRow();
        row.innerHTML = `
            <td>${access.seq}</td>
            <td>${access.hit ? access.block : ''}</td>
            <td>${!access.hit ? access.block : ''}</td>
            <td>${access.replacedIndex !== undefined ? access.replacedIndex : ''}</td>
        `;
    });

    const sequenceContainer = document.createElement('div');
    sequenceContainer.className = 'memory-sequence';
    sequenceContainer.appendChild(sequenceTable);

    results.simulationProcess.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'simulation-step';
        stepElement.innerHTML = `
            <h3>Step ${index + 1}: Access Block ${step.accessedBlock}</h3>
            <p>Cache State Before: ${step.cacheState.map(block => block === null ? '_' : block).join(' , ')}</p>
            <p style="color: ${step.hit ? 'darkgreen' : 'red'}; font-weight: bold;">
                ${step.hit ? 'Cache Hit' : 'Cache Miss'}
            </p>
            ${step.hit ? '' : `<p>Replaced Block at Index: ${step.replacedIndex}</p>`}
            <p>Cache State After: ${step.newCacheState.join(' , ')}</p>
        `;
        stepsContainer.appendChild(stepElement);
    });

    const simulationContainer = document.createElement('div');
    simulationContainer.className = 'simulation-container';
    simulationContainer.appendChild(stepsContainer);
    simulationContainer.appendChild(sequenceContainer);

    const outputSection = document.querySelector('.output-section');
    const resultsHeading = outputSection.querySelector('h2');
    outputSection.insertBefore(simulationContainer, resultsHeading);
}

function simulateCache(blockSize, mmSize, mmSizeUnit, cacheSize, cacheSizeUnit, programFlow, programFlowUnit, cacheAccessTime, memoryAccessTime) {
    // Convert sizes to blocks if necessary
    const mmSizeBlocks = mmSizeUnit === 'words' ? Math.ceil(mmSize / blockSize) : mmSize;
    const cacheSizeBlocks = cacheSizeUnit === 'words' ? Math.ceil(cacheSize / blockSize) : cacheSize;
    
    // Initialize cache
    let cache = new Array(cacheSizeBlocks).fill(null);
    let cacheAge = new Array(cacheSizeBlocks).fill(Infinity);
    let cacheHits = 0;
    let cacheMisses = 0;
    let memoryAccessSequence = [];
    let simulationProcess = [];

    for(let access of programFlow)
    {
        const block = programFlowUnit === 'words' ? Math.floor(access / blockSize) : access;
        const cacheStateBefore = [...cache];
        if(cache.includes(block)) 
        {
            cacheHits++;
            const index = cache.indexOf(block);
            cacheAge[index] = 0;
            memoryAccessSequence.push({ seq: access, hit: true, block });
            simulationProcess.push({
                accessedBlock: block,
                hit: true,
                cacheState: cacheStateBefore,
                newCacheState: [...cache],
            });
        } 
        else 
        {
            cacheMisses++;
            const emptyIndex = cache.indexOf(null);
            if(emptyIndex !== -1)
            {
                cache[emptyIndex] = block;
                cacheAge[emptyIndex] = 0;
                memoryAccessSequence.push({ seq: access, hit: false, block, replacedIndex: emptyIndex });
                simulationProcess.push({
                    accessedBlock: block,
                    hit: false,
                    cacheState: cacheStateBefore,
                    newCacheState: [...cache],
                    replacedIndex: emptyIndex
                });
            } 
            else 
            {
                const mruIndex = cacheAge.indexOf(Math.min(...cacheAge));
                cache[mruIndex] = block;
                cacheAge[mruIndex] = 0;
                memoryAccessSequence.push({ seq: access, hit: false, block, replacedIndex: mruIndex });
                simulationProcess.push({
                    accessedBlock: block,
                    hit: false,
                    cacheState: cacheStateBefore,
                    newCacheState: [...cache],
                    replacedIndex: mruIndex
                });
            }
        }
        cacheAge = cacheAge.map(age => age + 1);
    }

    // Calculate results for the output
    const missPenalty = cacheAccessTime + memoryAccessTime * blockSize + cacheAccessTime;
    const hitRate = cacheHits / programFlow.length;
    const avgAccessTime = (hitRate * cacheAccessTime) + (1 - hitRate) * missPenalty;
    const totalAccessTime = cacheHits * blockSize * cacheAccessTime + cacheMisses * blockSize * memoryAccessTime + cacheMisses * cacheAccessTime;
    const cacheSnapshot = cache.map((block, index) =>
        `Block ${index}: ${block !== null ? block : 'Empty'}`
    ).join('<br>');

    return {
        cacheHits,
        cacheMisses,
        missPenalty,
        avgAccessTime,
        totalAccessTime,
        cacheSnapshot,
        memoryAccessSequence,
        simulationProcess
    };
}

function downloadResults() 
{
    const cacheHits = document.getElementById('cacheHits').textContent.trim();
    const cacheMisses = document.getElementById('cacheMisses').textContent.trim();
    const missPenalty = document.getElementById('missPenalty').textContent.trim();
    const avgAccessTime = document.getElementById('avgAccessTime').textContent.trim();
    const totalAccessTime = document.getElementById('totalAccessTime').textContent.trim();
    const cacheSnapshot = document.getElementById('cacheSnapshot').innerHTML
        .replace(/<br\s*\/?>/gi, '\n')  // Convert <br> tags to newlines
        .replace(/<\/?[^>]+>/gi, '');   // Remove remaining HTML tags

    const resultsContent = 
`Results:

Number of Cache Hits: ${cacheHits}
Number of Cache Misses: ${cacheMisses}
Miss Penalty: ${missPenalty} ns
Average Memory Access Time: ${avgAccessTime} ns
Total Memory Access Time: ${totalAccessTime} ns

Cache Memory Snapshot:
${cacheSnapshot}
`;
    const blob = new Blob([resultsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'csarch2_s13_simulationproject_group4_results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}