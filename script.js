document.addEventListener('DOMContentLoaded', function() 
{
    const simulateButton = document.getElementById('simulate')
    const downloadButton = document.getElementById('downloadResults')

    simulateButton.addEventListener('click', runSimulation)
    downloadButton.addEventListener('click', downloadResults)
})

function runSimulation() 
{
    const blockSize = parseInt(document.getElementById('blockSize').value)
    const mmSize = parseInt(document.getElementById('mmSize').value)
    const mmSizeUnit = document.getElementById('mmSizeUnit').value
    const cacheSize = parseInt(document.getElementById('cacheSize').value)
    const cacheSizeUnit = document.getElementById('cacheSizeUnit').value
    const programFlow = document.getElementById('programFlow').value.split(',').map(Number)
    const programFlowUnit = document.getElementById('programFlowUnit').value
    const cacheAccessTime = parseFloat(document.getElementById('cacheAccessTime').value)
    const memoryAccessTime = parseFloat(document.getElementById('memoryAccessTime').value)

    // Will perform simulation after getting the inputs
    const results = simulateCache(blockSize, mmSize, mmSizeUnit, cacheSize, cacheSizeUnit, programFlow, programFlowUnit, cacheAccessTime, memoryAccessTime);

    // Display results here
    document.getElementById('cacheHits').textContent = results.cacheHits;
    document.getElementById('cacheMisses').textContent = results.cacheMisses;
    document.getElementById('missPenalty').textContent = results.missPenalty.toFixed(2);
    document.getElementById('avgAccessTime').textContent = results.avgAccessTime.toFixed(2);
    document.getElementById('totalAccessTime').textContent = results.totalAccessTime.toFixed(2);
    document.getElementById('cacheSnapshot').innerHTML = results.cacheSnapshot;
}

function simulateCache(blockSize, mmSize, mmSizeUnit, cacheSize, cacheSizeUnit, programFlow, programFlowUnit, cacheAccessTime, memoryAccessTime) {
    // Convert sizes to blocks if necessary
    const mmSizeBlocks = mmSizeUnit === 'words' ? Math.ceil(mmSize / blockSize) : mmSize
    const cacheSizeBlocks = cacheSizeUnit === 'words' ? Math.ceil(cacheSize / blockSize) : cacheSize
    // Initialize cache
    let cache = new Array(cacheSizeBlocks).fill(null);
    let cacheAge = new Array(cacheSizeBlocks).fill(Infinity);
    let cacheHits = 0;
    let cacheMisses = 0;

    document.getElementById('cacheSnapshot').append("Memory         Cache");
    for(let access of programFlow) {
        const block = programFlowUnit === 'words' ? Math.floor(access / blockSize) : access;

        if(cache.includes(block)) 
        {
            cacheHits++ // Cache hit
            const index = cache.indexOf(block);
            cacheAge[index] = 0;
        } 
        else 
        {
            cacheMisses++ // Cache miss
            const emptyIndex = cache.indexOf(null);
            if(emptyIndex !== -1)
            {
                // If empty spot, use it
                cache[emptyIndex] = block
                cacheAge[emptyIndex] = 0
            }
            else
            {
                // Else, replace the most recently used (mru)
                const mruIndex = cacheAge.indexOf(Math.min(...cacheAge))
                cache[mruIndex] = block
                cacheAge[mruIndex] = 0
            }
        }
        cacheAge = cacheAge.map(age => age + 1) // Increment age for all blocks
    }

    // Calculate results for the outpu
    const missPenalty = cacheAccessTime + memoryAccessTime*blockSize + cacheAccessTime 
    const hitRate = cacheHits / programFlow.length 
    const avgAccessTime = (hitRate * cacheAccessTime) + (1 - hitRate) * missPenalty 
    const totalAccessTime = cacheHits * 2 * cacheAccessTime + cacheMisses * missPenalty + cacheMisses * cacheAccessTime

    // Prepare cache snapshot
    const cacheSnapshot = cache.map((block, index) => 
        `Block ${index}: ${block !== null ? block : 'Empty'}`
    ).join('<br>');

    return{
        cacheHits,
        cacheMisses,
        missPenalty,
        avgAccessTime,
        totalAccessTime,
        cacheSnapshot
    }
}

function downloadResults() {
    const results = document.querySelector('.output-section').innerText;
    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'csarch2_s13_simulationproject_group4.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
