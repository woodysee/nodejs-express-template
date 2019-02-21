const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      useBuiltIns: "usage",
    },
  ],
];

// The browsers list above is just an arbitrary example. You will have to adapt it for the browsers you want to support.

module.exports = { presets };