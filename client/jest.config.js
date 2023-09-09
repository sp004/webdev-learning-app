module.exports = {  
    transformIgnorePatterns: ['node_modules/(?!axios.*)'],
    transform: {
        "^.+\\.(t|j)sx?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
        "\\.js$": "<rootDir>/node_modules/babel-jest"
    },
}