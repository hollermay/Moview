class NeuralNetwork {
    constructor(inputSize, hiddenSize, outputSize) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;

        this.weights1 = new Array(this.inputSize).fill(0).map(() =>
            new Array(this.hiddenSize).fill(0).map(() => Math.random())
        );

        this.weights2 = new Array(this.hiddenSize).fill(0).map(() =>
            new Array(this.outputSize).fill(0).map(() => Math.random())
        );
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    sigmoidDerivative(x) {
        return x * (1 - x);
    }

    feedforward(input) {
        this.hidden = input.map((inp, i) =>
            this.weights1[i].reduce((sum, w, j) => sum + inp * w, 0)
        ).map(this.sigmoid);

        this.output = this.hidden.map((h, i) =>
            this.weights2[i].reduce((sum, w, j) => sum + h * w, 0)
        ).map(this.sigmoid);

        return this.output;
    }

    train(input, target, learningRate = 0.1) {
        this.feedforward(input);

        const outputError = target.map((t, i) => t - this.output[i]);
        const outputDelta = outputError.map((error, i) =>
            error * this.sigmoidDerivative(this.output[i])
        );

        const hiddenError = this.weights2.map((weights, i) =>
            outputDelta.reduce((sum, delta, j) => sum + delta * weights[j], 0)
        );

        const hiddenDelta = hiddenError.map((error, i) =>
            error * this.sigmoidDerivative(this.hidden[i])
        );

        for (let i = 0; i < this.hiddenSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                this.weights2[i][j] += learningRate * outputDelta[j] * this.hidden[i];
            }
        }

        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.hiddenSize; j++) {
                this.weights1[i][j] += learningRate * hiddenDelta[j] * input[i];
            }
        }
    }
}

// Create the neural network
const nn = new NeuralNetwork(2, 2, 1);

// Example training dataset
const dataset = [
    {"input": [0, 0], "target": [0]},
    {"input": [0, 1], "target": [1]},
    {"input": [1, 0], "target": [1]},
    {"input": [1, 1], "target": [0]},
    {"input": [0.1, 0.1], "target": [0]},
    {"input": [0.1, 0.9], "target": [1]},
    {"input": [0.9, 0.1], "target": [1]},
    {"input": [0.9, 0.9], "target": [0]},
    {"input": [0.2, 0.2], "target": [0]},
    {"input": [0.2, 0.8], "target": [1]},
    {"input": [0.8, 0.2], "target": [1]},
    {"input": [0.8, 0.8], "target": [0]},
    {"input": [0.3, 0.3], "target": [0]},
    {"input": [0.3, 0.7], "target": [1]},
    {"input": [0.7, 0.3], "target": [1]},
    {"input": [0.7, 0.7], "target": [0]},
    {"input": [0.4, 0.4], "target": [0]},
    {"input": [0.4, 0.6], "target": [1]},
    {"input": [0.6, 0.4], "target": [1]},
    {"input": [0.6, 0.6], "target": [0]},
    {"input": [0.5, 0.5], "target": [0]},
    {"input": [0.1, 1], "target": [1]},
    {"input": [1, 0.1], "target": [1]},
    {"input": [0, 0.9], "target": [1]},
    {"input": [0.9, 1], "target": [0]},
    {"input": [0.1, 0], "target": [0]},
    {"input": [0.2, 0], "target": [0]},
    {"input": [0.3, 0], "target": [0]},
    {"input": [0.4, 0], "target": [0]},
    {"input": [0.5, 0], "target": [0]},
    {"input": [0.6, 0], "target": [0]},
    {"input": [0.7, 0], "target": [0]},
    {"input": [0.8, 0], "target": [0]},
    {"input": [0.9, 0], "target": [0]},
    {"input": [1, 0], "target": [0]},
    {"input": [0, 1], "target": [1]},
    {"input": [0.1, 0.9], "target": [1]},
    {"input": [0.2, 0.8], "target": [1]},
    {"input": [0.3, 0.7], "target": [1]},
    {"input": [0.4, 0.6], "target": [1]},
    {"input": [0.5, 0.5], "target": [1]},
    {"input": [0.6, 0.4], "target": [1]},
    {"input": [0.7, 0.3], "target": [1]},
    {"input": [0.8, 0.2], "target": [1]},
    {"input": [0.9, 0.1], "target": [1]},
    {"input": [1, 0.1], "target": [1]},
    {"input": [0.9, 0.9], "target": [0]}
];

// Train the network with the dataset
for (let i = 0; i < 10000; i++) {
    dataset.forEach(data => nn.train(data.input, data.target));
}

function predict() {
    const input = [0, 1]; // The input we want to predict
    const output = nn.feedforward(input);
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = `Prediction for input [0, 1]: ${output[0].toFixed(4)}`;
}
