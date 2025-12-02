const mongoose = require('mongoose');
const path = require('path');
const GraphicsSimulation = require('../models/GraphicsSimulation');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const graphicsSimulations = [
  {
    title: '2D Translation',
    description: 'Learn how to translate (move) 2D shapes along X and Y axes. Translation moves every point of a shape by the same distance in a given direction.',
    topicId: 'translation',
    dimension: '2d',
    language: 'english',
    icon: '↔️',
    difficulty: 'beginner',
    order: 1,
    instructions: 'Modify the tx and ty values to see how translation moves the shape. tx controls horizontal movement (X-axis) and ty controls vertical movement (Y-axis).',
    codeTemplate: `/**
 * 2D Translation Transformation
 * Canvas Graphics API Implementation
 * 
 * Translation moves a shape by adding tx to all x-coordinates
 * and ty to all y-coordinates.
 * 
 * Formula:
 * x' = x + tx
 * y' = y + ty
 */

// Translation parameters (modify these values)
const tx = 80;  // Translation in X-axis (horizontal)
const ty = 40;  // Translation in Y-axis (vertical)

/**
 * Main draw function
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function draw(ctx, canvas) {
  // Original shape (blue square)
  ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
  ctx.fillRect(125, 175, 80, 80);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.strokeRect(125, 175, 80, 80);
  
  // Translated shape (red square)
  ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
  ctx.fillRect(125 + tx, 175 + ty, 80, 80);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.strokeRect(125 + tx, 175 + ty, 80, 80);
  
  // Draw arrow showing translation vector
  drawArrow(ctx, 165, 215, 165 + tx, 215 + ty);
  
  // Labels
  ctx.fillStyle = '#000';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Original', 135, 165);
  ctx.fillText('Translated', 135 + tx, 165 + ty);
  ctx.font = '12px Arial';
  ctx.fillText(\`(tx: \${tx}, ty: \${ty})\`, 135 + tx, 270 + ty);
}

/**
 * Draw an arrow from (x1, y1) to (x2, y2)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x1 - Start X coordinate
 * @param {number} y1 - Start Y coordinate
 * @param {number} x2 - End X coordinate
 * @param {number} y2 - End Y coordinate
 */
function drawArrow(ctx, x1, y1, x2, y2) {
  const headLength = 10;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  
  // Draw line
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  
  // Draw arrowhead
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLength * Math.cos(angle - Math.PI / 6),
    y2 - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    x2 - headLength * Math.cos(angle + Math.PI / 6),
    y2 - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fillStyle = '#10b981';
  ctx.fill();
}`,
    editableVariables: [
      { name: 'tx', type: 'number', defaultValue: 80, min: -200, max: 200, description: 'Translation in X-axis' },
      { name: 'ty', type: 'number', defaultValue: 40, min: -200, max: 200, description: 'Translation in Y-axis' }
    ]
  },
  {
    title: '2D Scaling',
    description: 'Understand 2D scaling transformations. Scaling changes the size of shapes by multiplying coordinates by scale factors.',
    topicId: 'scaling',
    dimension: '2d',
    language: 'english',
    icon: '⊕',
    difficulty: 'beginner',
    order: 2,
    instructions: 'Change sx and sy to scale the shape. sx > 1 stretches horizontally, sx < 1 shrinks. Same for sy vertically.',
    codeTemplate: `/**
 * 2D Scaling Transformation
 * Canvas Graphics API Implementation
 * 
 * Scaling multiplies coordinates by scale factors.
 * Scaling is performed relative to a fixed point (usually center).
 * 
 * Formula (relative to origin):
 * x' = x * sx
 * y' = y * sy
 * 
 * Formula (relative to center point cx, cy):
 * x' = cx + (x - cx) * sx
 * y' = cy + (y - cy) * sy
 */

// Scaling parameters (modify these values)
const sx = 1.5;  // Scaling factor in X-axis (1.0 = no change)
const sy = 0.8;  // Scaling factor in Y-axis (1.0 = no change)

/**
 * Main draw function
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function draw(ctx, canvas) {
  const centerX = 250;
  const centerY = 250;
  const size = 80;
  
  // Original shape (blue square)
  ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
  ctx.fillRect(centerX - size/2, centerY - size/2, size, size);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.strokeRect(centerX - size/2, centerY - size/2, size, size);
  
  // Scaled shape (red)
  const scaledWidth = size * sx;
  const scaledHeight = size * sy;
  ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
  ctx.fillRect(
    centerX - scaledWidth/2,
    centerY - scaledHeight/2,
    scaledWidth,
    scaledHeight
  );
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.strokeRect(
    centerX - scaledWidth/2,
    centerY - scaledHeight/2,
    scaledWidth,
    scaledHeight
  );
  
  // Draw center point
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw center marker
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - 10, centerY);
  ctx.lineTo(centerX + 10, centerY);
  ctx.moveTo(centerX, centerY - 10);
  ctx.lineTo(centerX, centerY + 10);
  ctx.stroke();
  
  // Labels
  ctx.fillStyle = '#000';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Original', centerX - 30, centerY - size/2 - 10);
  ctx.font = '12px Arial';
  ctx.fillText(\`Scaled (sx: \${sx}, sy: \${sy})\`,
    centerX - 60, centerY + scaledHeight/2 + 25);
  ctx.fillText('Center Point', centerX + 15, centerY - 5);
}`,
    editableVariables: [
      { name: 'sx', type: 'number', defaultValue: 1.5, min: 0.1, max: 3, description: 'Scaling factor in X-axis' },
      { name: 'sy', type: 'number', defaultValue: 0.8, min: 0.1, max: 3, description: 'Scaling factor in Y-axis' }
    ]
  },
  {
    title: '2D Rotation',
    description: 'Explore 2D rotation transformations. Rotation turns shapes around a fixed point (pivot) by a specified angle.',
    topicId: 'rotation',
    dimension: '2d',
    language: 'english',
    icon: '↻',
    difficulty: 'intermediate',
    order: 3,
    instructions: 'Adjust the angle value (in degrees) to rotate the shape around its center. 0° = no rotation, 90° = quarter turn.',
    codeTemplate: `/**
 * 2D Rotation Transformation
 * Canvas Graphics API Implementation
 * 
 * Rotation turns points around a fixed center point.
 * Uses trigonometric functions (sin, cos).
 * 
 * Formula (rotation around origin):
 * x' = x * cos(θ) - y * sin(θ)
 * y' = x * sin(θ) + y * cos(θ)
 * 
 * Formula (rotation around point cx, cy):
 * Translate to origin → Rotate → Translate back
 */

// Rotation parameter (modify this value)
const angle = 45;  // Rotation angle in degrees (0-360)

/**
 * Main draw function
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function draw(ctx, canvas) {
  const centerX = 250;
  const centerY = 250;
  const size = 80;
  
  // Original shape (blue square)
  ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
  ctx.fillRect(centerX - size/2, centerY - size/2, size, size);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.strokeRect(centerX - size/2, centerY - size/2, size, size);
  
  // Save the current context state
  ctx.save();
  
  // Move to center, rotate, then move back
  ctx.translate(centerX, centerY);
  ctx.rotate(angle * Math.PI / 180); // Convert degrees to radians
  ctx.translate(-centerX, -centerY);
  
  // Rotated shape (red)
  ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
  ctx.fillRect(centerX - size/2, centerY - size/2, size, size);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.strokeRect(centerX - size/2, centerY - size/2, size, size);
  
  // Restore the context to un-rotated state
  ctx.restore();
  
  // Draw center point
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw rotation arc to visualize angle
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 60, 0, angle * Math.PI / 180);
  ctx.stroke();
  
  // Labels
  ctx.fillStyle = '#000';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Original', centerX + size/2 + 10, centerY - size/2);
  ctx.font = '12px Arial';
  ctx.fillText(\`Rotated \${angle}°\`, centerX + size/2 + 10, centerY + size/2);
  ctx.fillText('Pivot Point', centerX + 15, centerY - 5);
}`,
    editableVariables: [
      { name: 'angle', type: 'number', defaultValue: 45, min: 0, max: 360, description: 'Rotation angle in degrees' }
    ]
  },
  {
    title: '2D Shearing',
    description: 'Learn about shearing transformations. Shearing slants shapes by shifting points proportionally.',
    topicId: 'shearing',
    dimension: '2d',
    language: 'english',
    icon: '⧄',
    difficulty: 'intermediate',
    order: 4,
    instructions: 'Modify shx for horizontal shear and shy for vertical shear. Positive values slant right/up, negative left/down.',
    codeTemplate: `/**
 * 2D Shearing (Skewing) Transformation
 * Canvas Graphics API Implementation
 * 
 * Shearing slants shapes along one or both axes.
 * It shifts points proportionally to their distance from an axis.
 * 
 * Formula:
 * x' = x + shx * y
 * y' = y + shy * x
 * 
 * Matrix form:
 * | 1    shx |   | x |
 * | shy   1  | × | y |
 */

// Shearing parameters (modify these values)
const shx = 0.5;  // Shearing factor in X direction
const shy = 0.0;  // Shearing factor in Y direction

/**
 * Main draw function
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function draw(ctx, canvas) {
  const x = 150;
  const y = 150;
  const size = 100;
  
  // Original shape (blue square)
  ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, size, size);
  
  // Apply shear transformation using transform matrix
  ctx.save();
  // transform(a, b, c, d, e, f) where:
  // a = horizontal scaling (1 = no change)
  // b = vertical skewing (shy)
  // c = horizontal skewing (shx)
  // d = vertical scaling (1 = no change)
  // e, f = translation (0, 0 = no translation)
  ctx.transform(1, shy, shx, 1, 0, 0);
  
  // Sheared shape (red)
  ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, size, size);
  
  ctx.restore();
  
  // Draw reference lines
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvas.height);
  ctx.moveTo(x + size, 0);
  ctx.lineTo(x + size, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Labels
  ctx.fillStyle = '#000';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Original', x + 10, y - 10);
  ctx.font = '12px Arial';
  ctx.fillText(\`Sheared (shx: \${shx}, shy: \${shy})\`,
    x + size * shx + 10, y + size + 20);
}`,
    editableVariables: [
      { name: 'shx', type: 'number', defaultValue: 0.5, min: -1, max: 1, description: 'Horizontal shear factor' },
      { name: 'shy', type: 'number', defaultValue: 0.0, min: -1, max: 1, description: 'Vertical shear factor' }
    ]
  },
  {
    title: '3D Translation',
    description: 'Understand 3D translation using isometric projection. Move 3D objects in X, Y, and Z dimensions.',
    topicId: 'translation3d',
    dimension: '3d',
    language: 'english',
    icon: '🔲',
    difficulty: 'intermediate',
    order: 5,
    instructions: 'Modify tx, ty, and tz to translate the 3D cube. Notice how tz (depth) affects the position in the isometric view.',
    codeTemplate: `/**
 * 3D Translation Transformation
 * Isometric Projection Implementation
 * 
 * 3D Translation moves objects in 3D space along X, Y, and Z axes.
 * We use isometric projection to render 3D on 2D canvas.
 * 
 * Isometric projection formulas:
 * screenX = x - z
 * screenY = y - z * 0.5
 * 
 * This creates a 2:1 pixel ratio for the Z-axis depth.
 */

// 3D Translation parameters (modify these values)
const tx = 80;   // Translation in X-axis (right/left)
const ty = -40;  // Translation in Y-axis (down/up)
const tz = 30;   // Translation in Z-axis (depth)

/**
 * Main draw function
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function draw(ctx, canvas) {
  // Draw original cube at initial position
  drawCube(ctx, 120, 250, 0, 50, '#3b82f6', 'Original');
  
  // Draw translated cube
  drawCube(ctx, 120 + tx, 250 + ty, tz, 50, '#ef4444', 'Translated');
  
  // Draw translation vector arrow
  drawArrow3D(ctx, 145, 250, 145 + tx, 250 + ty, tz);
  
  // Display translation values
  ctx.fillStyle = '#000';
  ctx.font = '12px Arial';
  ctx.fillText(\`Translation: (tx: \${tx}, ty: \${ty}, tz: \${tz})\`, 10, 30);
}

/**
 * Draw a 3D cube in isometric view
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} z - Z position (depth)
 * @param {number} size - Cube size
 * @param {string} color - Cube color
 * @param {string} label - Label text
 */
function drawCube(ctx, x, y, z, size, color, label) {
  // Apply isometric projection to Z
  const iso = toIsometric(0, 0, z);
  const zOffset = iso.y;
  
  // Calculate cube vertices in isometric view
  const vertices = [
    [x, y + zOffset],
    [x + size, y + zOffset],
    [x + size, y - size + zOffset],
    [x, y - size + zOffset],
    [x, y - size * 1.5 + zOffset],
    [x + size, y - size * 1.5 + zOffset],
    [x + size, y - size * 0.5 + zOffset],
    [x, y - size * 0.5 + zOffset]
  ];
  
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  
  // Front face
  ctx.fillStyle = color + '80';
  drawFace(ctx, [vertices[0], vertices[1], vertices[2], vertices[3]]);
  
  // Top face
  ctx.fillStyle = color + '60';
  drawFace(ctx, [vertices[3], vertices[2], vertices[6], vertices[7]]);
  
  // Right face
  ctx.fillStyle = color + '40';
  drawFace(ctx, [vertices[1], vertices[2], vertices[6], vertices[5]]);
  
  // Label
  ctx.fillStyle = '#000';
  ctx.font = 'bold 12px Arial';
  ctx.fillText(label, x, y - size * 1.5 + zOffset - 10);
}

/**
 * Draw a face of the cube
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} vertices - Array of [x, y] vertex coordinates
 */
function drawFace(ctx, vertices) {
  ctx.beginPath();
  ctx.moveTo(vertices[0][0], vertices[0][1]);
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(vertices[i][0], vertices[i][1]);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/**
 * Convert 3D coordinates to isometric 2D
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} z - Z coordinate
 * @returns {Object} Isometric {x, y} coordinates
 */
function toIsometric(x, y, z) {
  return {
    x: x - z,
    y: y - z * 0.5
  };
}

/**
 * Draw arrow showing 3D translation
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x1 - Start X
 * @param {number} y1 - Start Y
 * @param {number} x2 - End X
 * @param {number} y2 - End Y
 * @param {number} z - Z offset
 */
function drawArrow3D(ctx, x1, y1, x2, y2, z) {
  const iso = toIsometric(0, 0, z);
  y2 += iso.y;
  
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(angle - Math.PI / 6),
             y2 - 10 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - 10 * Math.cos(angle + Math.PI / 6),
             y2 - 10 * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fillStyle = '#10b981';
  ctx.fill();
}`,
    editableVariables: [
      { name: 'tx', type: 'number', defaultValue: 80, min: -150, max: 150, description: 'Translation in X-axis' },
      { name: 'ty', type: 'number', defaultValue: -40, min: -150, max: 150, description: 'Translation in Y-axis' },
      { name: 'tz', type: 'number', defaultValue: 30, min: -100, max: 100, description: 'Translation in Z-axis' }
    ]
  },
  {
    title: '3D Rotation',
    description: 'Visualize 3D rotation with animated cube rotation around Y-axis using perspective projection.',
    topicId: 'rotation3d',
    dimension: '3d',
    language: 'english',
    icon: '🔄',
    difficulty: 'advanced',
    order: 6,
    instructions: 'Watch the cube rotate automatically. The angle increments each frame. You can modify the initial angleY value.',
    codeTemplate: `/**
 * 3D Rotation Transformation
 * Perspective Projection with Animation
 * 
 * 3D rotation uses rotation matrices to transform vertices.
 * Y-axis rotation formula:
 * x' = x * cos(θ) + z * sin(θ)
 * y' = y
 * z' = -x * sin(θ) + z * cos(θ)
 * 
 * Perspective projection formula:
 * screenX = (x * focalLength) / (z + distance) + centerX
 * screenY = (y * focalLength) / (z + distance) + centerY
 */

// Rotation parameter (auto-increments for animation)
let angleY = 0;  // Rotation angle around Y-axis

/**
 * Main draw function (called repeatedly for animation)
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function draw(ctx, canvas) {
  // Auto-increment rotation angle
  angleY += 1;
  if (angleY >= 360) angleY = 0;
  
  const centerX = 250;
  const centerY = 250;
  const size = 80;
  
  // Define cube vertices in 3D space (unit cube)
  const vertices = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],  // Front face
    [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]    // Back face
  ];
  
  // Apply Y-axis rotation to all vertices
  const rotatedVertices = vertices.map(v => rotateY(v, angleY));
  
  // Project 3D vertices to 2D screen coordinates
  const projectedVertices = rotatedVertices.map(v => 
    projectVertex(v, centerX, centerY, size)
  );
  
  // Define edges (which vertices to connect)
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],  // Front face
    [4, 5], [5, 6], [6, 7], [7, 4],  // Back face
    [0, 4], [1, 5], [2, 6], [3, 7]   // Connecting edges
  ];
  
  // Draw all edges
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  edges.forEach(([i, j]) => {
    ctx.beginPath();
    ctx.moveTo(projectedVertices[i].x, projectedVertices[i].y);
    ctx.lineTo(projectedVertices[j].x, projectedVertices[j].y);
    ctx.stroke();
  });
  
  // Draw vertices as points
  projectedVertices.forEach((p, i) => {
    ctx.fillStyle = i < 4 ? '#ef4444' : '#10b981';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Display rotation angle
  ctx.fillStyle = '#000';
  ctx.font = 'bold 16px Arial';
  ctx.fillText(\`Y-Axis Rotation: \${Math.round(angleY)}°\`, centerX - 80, 50);
  
  // Draw rotation axis indicator
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 100);
  ctx.lineTo(centerX, centerY + 100);
  ctx.stroke();
  
  ctx.fillStyle = '#f59e0b';
  ctx.font = '12px Arial';
  ctx.fillText('Y-Axis', centerX + 10, centerY - 90);
}

/**
 * Rotate a 3D vertex around Y-axis
 * @param {Array} vertex - [x, y, z] coordinates
 * @param {number} angle - Rotation angle in degrees
 * @returns {Array} Rotated [x, y, z] coordinates
 */
function rotateY(vertex, angle) {
  const rad = angle * Math.PI / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  
  return [
    vertex[0] * cos + vertex[2] * sin,
    vertex[1],
    -vertex[0] * sin + vertex[2] * cos
  ];
}

/**
 * Project 3D vertex to 2D screen coordinates
 * Uses perspective projection for realistic depth
 * @param {Array} vertex - [x, y, z] coordinates
 * @param {number} cx - Center X of screen
 * @param {number} cy - Center Y of screen
 * @param {number} scale - Scaling factor
 * @returns {Object} Screen {x, y} coordinates
 */
function projectVertex(vertex, cx, cy, scale) {
  const distance = 4;  // Camera distance
  const focalLength = 200;
  
  const z = vertex[2] + distance;
  const factor = focalLength / z;
  
  return {
    x: cx + vertex[0] * scale * factor,
    y: cy - vertex[1] * scale * factor
  };
}`,
    editableVariables: [
      { name: 'angleY', type: 'number', defaultValue: 0, min: 0, max: 360, description: 'Initial rotation angle' }
    ]
  },
  {
    title: '3D Scaling',
    description: 'Learn 3D scaling transformations in isometric view. Scale objects along X, Y, and Z axes independently.',
    topicId: 'scaling3d',
    dimension: '3d',
    language: 'english',
    icon: '📦',
    difficulty: 'intermediate',
    order: 7,
    instructions: 'Adjust sx, sy, and sz to scale the cube in 3D space. Values > 1 enlarge, values < 1 shrink along each axis.',
    codeTemplate: `/**
 * 3D Scaling Transformation
 * Isometric Projection Implementation
 * 
 * 3D Scaling multiplies coordinates by scale factors.
 * Each axis can be scaled independently.
 * 
 * Formula:
 * x' = x * sx
 * y' = y * sy
 * z' = z * sz
 * 
 * Uniform scaling: sx = sy = sz
 * Non-uniform scaling: different values for each axis
 */

// 3D Scaling parameters (modify these values)
const sx = 1.5;  // Scaling factor in X-axis
const sy = 1.0;  // Scaling factor in Y-axis
const sz = 0.7;  // Scaling factor in Z-axis

/**
 * Main draw function
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function draw(ctx, canvas) {
  const centerX = 250;
  const centerY = 280;
  
  // Draw original cube with unit scale (1, 1, 1)
  drawScaledCube(ctx, centerX - 80, centerY, 1, 1, 1, 45, '#3b82f6');
  
  // Draw scaled cube
  drawScaledCube(ctx, centerX + 80, centerY, sx, sy, sz, 45, '#ef4444');
  
  // Labels
  ctx.fillStyle = '#000';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Original (1, 1, 1)', centerX - 110, centerY + 80);
  ctx.fillText(\`Scaled (\${sx}, \${sy}, \${sz})\`, centerX + 40, centerY + 80);
  
  // Draw scale indicators
  drawScaleIndicator(ctx, centerX + 80, centerY, sx, sy, sz, 45);
}

/**
 * Draw a scaled 3D cube in isometric view
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} sx - X-axis scale factor
 * @param {number} sy - Y-axis scale factor
 * @param {number} sz - Z-axis scale factor
 * @param {number} size - Base size
 * @param {string} color - Cube color
 */
function drawScaledCube(ctx, x, y, sx, sy, sz, size, color) {
  const w = size * sx;  // Width (X-axis)
  const h = size * sy;  // Height (Y-axis)
  const d = size * sz;  // Depth (Z-axis)
  
  // Isometric projection offsets for depth
  const isoX = d * 0.5;
  const isoY = d * 0.25;
  
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  
  // Front face (XY plane)
  ctx.fillStyle = color + '80';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y - h);
  ctx.lineTo(x, y - h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Top face (XZ plane)
  ctx.fillStyle = color + '60';
  ctx.beginPath();
  ctx.moveTo(x, y - h);
  ctx.lineTo(x + w, y - h);
  ctx.lineTo(x + w + isoX, y - h - isoY);
  ctx.lineTo(x + isoX, y - h - isoY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Right face (YZ plane)
  ctx.fillStyle = color + '40';
  ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w + isoX, y - isoY);
  ctx.lineTo(x + w + isoX, y - h - isoY);
  ctx.lineTo(x + w, y - h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/**
 * Draw scale factor indicators
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} sx - X scale
 * @param {number} sy - Y scale
 * @param {number} sz - Z scale
 * @param {number} size - Base size
 */
function drawScaleIndicator(ctx, x, y, sx, sy, sz, size) {
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  
  const w = size * sx;
  const h = size * sy;
  const d = size * sz;
  const isoX = d * 0.5;
  const isoY = d * 0.25;
  
  // X-axis indicator
  ctx.beginPath();
  ctx.moveTo(x, y + 20);
  ctx.lineTo(x + w, y + 20);
  ctx.stroke();
  
  // Y-axis indicator
  ctx.beginPath();
  ctx.moveTo(x - 20, y);
  ctx.lineTo(x - 20, y - h);
  ctx.stroke();
  
  // Z-axis indicator
  ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w + isoX, y - isoY);
  ctx.stroke();
  
  ctx.setLineDash([]);
  
  // Labels
  ctx.fillStyle = '#10b981';
  ctx.font = '11px Arial';
  ctx.fillText(\`X: \${sx}\`, x + w/2 - 10, y + 35);
  ctx.fillText(\`Y: \${sy}\`, x - 40, y - h/2);
  ctx.fillText(\`Z: \${sz}\`, x + w + isoX/2 + 5, y - isoY/2);
}`,
    editableVariables: [
      { name: 'sx', type: 'number', defaultValue: 1.5, min: 0.2, max: 2.5, description: 'X-axis scale factor' },
      { name: 'sy', type: 'number', defaultValue: 1.0, min: 0.2, max: 2.5, description: 'Y-axis scale factor' },
      { name: 'sz', type: 'number', defaultValue: 0.7, min: 0.2, max: 2.5, description: 'Z-axis scale factor' }
    ]
  }
];

const seedGraphicsSimulations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing simulations
    await GraphicsSimulation.deleteMany({});
    console.log('🗑️  Cleared existing graphics simulations');

    // Insert new simulations
    const result = await GraphicsSimulation.insertMany(graphicsSimulations);
    console.log(`✅ Successfully seeded ${result.length} graphics simulations`);

    console.log('\nSeeded simulations:');
    result.forEach((sim, index) => {
      console.log(`${index + 1}. ${sim.title} (${sim.topicId}) - ${sim.dimension.toUpperCase()}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
seedGraphicsSimulations();
