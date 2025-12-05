/**
 * Demo Box - Parametric Container with Lid
 * A more advanced example demonstrating JSCAD capabilities
 */

const { cuboid, cylinder } = require('@jscad/modeling').primitives;
const { subtract, union } = require('@jscad/modeling').booleans;
const { translate } = require('@jscad/modeling').transforms;

const getParameterDefinitions = () => {
  return [
    { 
      name: 'width', 
      type: 'number', 
      initial: 50, 
      min: 20, 
      max: 100,
      caption: 'Box Width (mm)' 
    },
    { 
      name: 'depth', 
      type: 'number', 
      initial: 50, 
      min: 20, 
      max: 100,
      caption: 'Box Depth (mm)' 
    },
    { 
      name: 'height', 
      type: 'number', 
      initial: 30, 
      min: 10, 
      max: 80,
      caption: 'Box Height (mm)' 
    },
    { 
      name: 'wallThickness', 
      type: 'number', 
      initial: 2, 
      min: 1, 
      max: 5,
      caption: 'Wall Thickness (mm)' 
    },
    { 
      name: 'cornerRadius', 
      type: 'number', 
      initial: 3, 
      min: 0, 
      max: 10,
      caption: 'Corner Radius (mm)' 
    },
  ];
};

const main = (params) => {
  const { width, depth, height, wallThickness, cornerRadius } = params;
  
  // Create outer box
  const outer = cuboid({ 
    size: [width, depth, height],
    center: [0, 0, height / 2]
  });
  
  // Create inner cavity (slightly raised to leave a bottom)
  const bottomThickness = wallThickness;
  const inner = cuboid({ 
    size: [
      width - wallThickness * 2, 
      depth - wallThickness * 2, 
      height - bottomThickness
    ],
    center: [0, 0, (height - bottomThickness) / 2 + bottomThickness]
  });
  
  // Create the box by subtracting inner from outer
  let box = subtract(outer, inner);
  
  // Add mounting holes in the corners (optional feature)
  const holeRadius = 1.6; // M3 screw with tolerance
  const holeOffset = wallThickness + 3;
  const holeDepth = bottomThickness + 1;
  
  const holes = [
    [-width/2 + holeOffset, -depth/2 + holeOffset, 0],
    [width/2 - holeOffset, -depth/2 + holeOffset, 0],
    [-width/2 + holeOffset, depth/2 - holeOffset, 0],
    [width/2 - holeOffset, depth/2 - holeOffset, 0],
  ].map(pos => {
    return translate(
      pos,
      cylinder({ 
        radius: holeRadius, 
        height: holeDepth,
        center: [0, 0, holeDepth / 2]
      })
    );
  });
  
  // Subtract holes from box
  box = subtract(box, ...holes);
  
  return box;
};

module.exports = { main, getParameterDefinitions };
