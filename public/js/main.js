const shortenBy = 1


window.addEventListener("load", async () => {
    const status = document.querySelector("#loading-status")
    const setStatus = newStatus => status.innerHTML = newStatus

    setStatus("Downloading graph data...")

    const rawData = await getGraphData()
    setStatus("Calculating graphs...")
    const data = rawData[0]
    const calculated = data.map(e => calculateGraph(e))

    const allLabels = calculated.map(e => e.labels)
    const allLabelsAreSame = getSameLengthArrays(allLabels)

    if(allLabelsAreSame)
        createChart(calculated)
    else
        calculated.map((graph, i) => createChart([ graph ], i))


    showGraph()
})

function showGraph() {
    const loading = document.querySelector("#loading")
    const graphDiv = document.querySelector("#graphDiv")

    loading.classList.add("d-none")
    graphDiv.classList.remove("invisible")
}

async function getGraphData() {
    const res = await fetch("/json/graphData.json")
    return await res.json()
}

function shortenArray(arr, dividend) {
    const out = []
    for (let i = 0; i < arr.length; i++) {
        const shouldAdd = i % dividend === 0
        if (shouldAdd)
            out.push(arr[i])
    }

    return out
}

function calculateGraph(graph) {
    const labels = []
    
    const shortened = shortenArray(graph, shortenBy)
    const data = shortened.map(e => {
        const formatted = moment(new Date(e.x)).format("Do MMM YYYY")
        labels.push(formatted)
        return e.y
    })

    return {
        labels: labels,
        data: data
    }
}

function createChart(graphData, i) {
    const graphDiv = document.querySelector("#graphDiv")

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")


    graphDiv.appendChild(canvas)
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: graphData[0].labels,
            datasets: graphData.map((data, x) => {
                return {
                    label: `Graph #${i ?? x}`,
                    pointRadius: 0,
                    data: data.data,
                    borderColor: window.Colors.random()
                }
            })
        }
    });
}

function getSameLengthArrays(arrays) {
    const firstElement = arrays[0].length
    return arrays.filter(e => e.length === firstElement).length === arrays.length
}