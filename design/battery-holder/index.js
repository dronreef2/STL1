/**
 * Parametric 18650 Battery Holder
 * Holds multiple 18650 lithium-ion batteries with adjustable tolerance
 * 
 * Standard 18650 specifications:
 * - Diameter: 18mm (nominal)
 * - Length: 65mm (nominal, varies 65-70mm with protection circuits)
 * - Recommended loose fit tolerance: +0.3mm to +0.5mm (diameter), +1mm (length)
 */

const { cuboid, cylinder } = require('@jscad/modeling').primitives;
const { subtract, union } = require('@jscad/modeling').booleans;
const { translate } = require('@jscad/modeling').transforms;

const getParameterDefinitions = () => {
  return [
    { 
      name: 'numCells', 
      type: 'number', 
      initial: 2, 
      min: 1, 
      max: 6,
      caption: 'Number of Battery Cells' 
    },
    { 
      name: 'tolerance', 
      type: 'number', 
      initial: 0.4, 
      min: 0.2, 
      max: 1.0,
      step: 0.1,
      caption: 'Tolerance (mm) - Clearance for easy fit' 
    },
    { 
      name: 'baseThickness', 
      type: 'number', 
      initial: 3, 
      min: 2, 
      max: 10,
      caption: 'Base Thickness (mm)' 
    },
    { 
      name: 'wallThickness', 
      type: 'number', 
      initial: 2.5, 
      min: 1.5, 
      max: 5,
      caption: 'Wall Thickness (mm)' 
    },
  ];
};

const main = (params) => {
  const { numCells, tolerance, baseThickness, wallThickness } = params;
  
  // 18650 battery standard dimensions
  const batteryDiameter = 18;
  const batteryLength = 65;
  
  // Battery insertion depth ratio (how deep batteries sit in the holder)
  const BATTERY_INSERTION_DEPTH_RATIO = 0.7; // 70% of battery length is inserted
  
  // Apply tolerance to create the hole size
  const holeDiameter = batteryDiameter + tolerance;
  const holeDepth = batteryLength + 1; // Extra 1mm for length variation
  
  // Calculate holder dimensions
  const spacing = holeDiameter + wallThickness; // Space between cell centers
  const totalWidth = (numCells * spacing) + wallThickness;
  const holderDepth = holeDiameter + wallThickness * 2;
  const holderHeight = baseThickness + holeDepth * BATTERY_INSERTION_DEPTH_RATIO;
  
  // Create the base block
  const base = cuboid({ 
    size: [totalWidth, holderDepth, holderHeight],
    center: [0, 0, holderHeight / 2]
  });
  
  // Create battery holes (cylinders to subtract)
  // Holes are vertical cylinders positioned from the base up
  const holes = [];
  const startX = -(numCells - 1) * spacing / 2;
  
  // Center position for cylinder: base + half of insertion depth
  const holeCenterZ = baseThickness + (holeDepth * BATTERY_INSERTION_DEPTH_RATIO) / 2;
  
  for (let i = 0; i < numCells; i++) {
    const xPos = startX + (i * spacing);
    
    // Create vertical cylinder hole for battery
    const hole = translate(
      [xPos, 0, holeCenterZ],
      cylinder({ 
        radius: holeDiameter / 2, 
        height: holeDepth * BATTERY_INSERTION_DEPTH_RATIO,
        segments: 32
      })
    );
    
    holes.push(hole);
  }
  
  // Create the holder by subtracting holes from base
  let holder = subtract(base, ...holes);
  
  // Add small support ridges on the bottom to prevent sliding
  const ridgeWidth = 1;
  const ridgeHeight = 1;
  const ridge1 = translate(
    [0, -holderDepth/2 + wallThickness/2, ridgeHeight/2],
    cuboid({ 
      size: [totalWidth - wallThickness * 2, ridgeWidth, ridgeHeight]
    })
  );
  const ridge2 = translate(
    [0, holderDepth/2 - wallThickness/2, ridgeHeight/2],
    cuboid({ 
      size: [totalWidth - wallThickness * 2, ridgeWidth, ridgeHeight]
    })
  );
  
  holder = union(holder, ridge1, ridge2);
  
  return holder;
};

module.exports = { main, getParameterDefinitions };
