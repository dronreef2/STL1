/**
 * Example: Simple Cube
 * This is a basic test file to verify JSCAD installation
 */

const { cuboid } = require('@jscad/modeling').primitives;

const getParameterDefinitions = () => {
  return [
    { name: 'size', type: 'number', initial: 10, caption: 'Cube Size (mm)' }
  ];
};

const main = (params) => {
  const size = params.size || 10;
  return cuboid({ size: [size, size, size] });
};

module.exports = { main, getParameterDefinitions };
