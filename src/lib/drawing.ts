/**
 * Canvas drawing utilities for different object types
 */

/**
 * Draw a ball (sphere) on the canvas
 * @param ctx - Canvas rendering context
 * @param x - X position (center)
 * @param y - Y position (center)
 * @param radius - Ball radius in pixels
 * @param color - Fill color
 */
export function drawBall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
): void {
  ctx.save();
  ctx.translate(x, y);

  // Draw shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(radius * 0.3, radius * 1.2, radius * 0.8, radius * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw main ball with radial gradient for 3D sphere effect
  const gradient = ctx.createRadialGradient(
    -radius * 0.3, -radius * 0.3, radius * 0.1,
    0, 0, radius
  );
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.3, color);
  gradient.addColorStop(1, shadeColor(color, -40));
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fill();

  // Add specular highlight for glossy effect
  const highlightGradient = ctx.createRadialGradient(
    -radius * 0.35, -radius * 0.35, 0,
    -radius * 0.35, -radius * 0.35, radius * 0.5
  );
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = highlightGradient;
  ctx.beginPath();
  ctx.arc(-radius * 0.25, -radius * 0.25, radius * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Add subtle outline with depth
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.restore();
}

// Helper function to shade colors
function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return `rgb(${R}, ${G}, ${B})`;
}

/**
 * Draw a car on the canvas
 * @param ctx - Canvas rendering context
 * @param x - X position (center)
 * @param y - Y position (center)
 * @param width - Car width in pixels
 * @param height - Car height in pixels
 * @param color - Car body color
 */
export function drawCar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
): void {
  ctx.save();
  ctx.translate(x, y);

  const cornerRadius = 4;
  const wheelRadius = height * 0.25;
  const wheelOffset = width * 0.3;

  // Draw shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(0, height * 0.7, width * 0.5, height * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw car body with gradient for depth
  const bodyGradient = ctx.createLinearGradient(0, -height / 2, 0, height / 2);
  bodyGradient.addColorStop(0, shadeColor(color, 30));
  bodyGradient.addColorStop(0.5, color);
  bodyGradient.addColorStop(1, shadeColor(color, -20));
  
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.moveTo(-width / 2 + cornerRadius, -height / 2);
  ctx.arcTo(width / 2, -height / 2, width / 2, height / 2, cornerRadius);
  ctx.arcTo(width / 2, height / 2, -width / 2, height / 2, cornerRadius);
  ctx.arcTo(-width / 2, height / 2, -width / 2, -height / 2, cornerRadius);
  ctx.arcTo(-width / 2, -height / 2, width / 2, -height / 2, cornerRadius);
  ctx.closePath();
  ctx.fill();

  // Add car body outline with depth
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Draw roof/cabin
  ctx.fillStyle = shadeColor(color, -10);
  ctx.beginPath();
  ctx.moveTo(-width * 0.3, -height / 2);
  ctx.lineTo(-width * 0.15, -height * 0.7);
  ctx.lineTo(width * 0.15, -height * 0.7);
  ctx.lineTo(width * 0.3, -height / 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.stroke();

  // Draw windshield with reflection gradient
  const windshieldGradient = ctx.createLinearGradient(
    0, -height * 0.65,
    0, -height * 0.3
  );
  windshieldGradient.addColorStop(0, 'rgba(135, 206, 250, 0.6)');
  windshieldGradient.addColorStop(0.5, 'rgba(100, 150, 200, 0.5)');
  windshieldGradient.addColorStop(1, 'rgba(70, 120, 180, 0.4)');
  
  ctx.fillStyle = windshieldGradient;
  ctx.beginPath();
  ctx.moveTo(-width * 0.25, -height * 0.45);
  ctx.lineTo(-width * 0.12, -height * 0.65);
  ctx.lineTo(width * 0.12, -height * 0.65);
  ctx.lineTo(width * 0.25, -height * 0.45);
  ctx.closePath();
  ctx.fill();

  // Windshield highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.moveTo(-width * 0.2, -height * 0.5);
  ctx.lineTo(-width * 0.1, -height * 0.63);
  ctx.lineTo(0, -height * 0.63);
  ctx.lineTo(-width * 0.05, -height * 0.5);
  ctx.closePath();
  ctx.fill();

  // Draw wheels with 3D effect
  for (const xOff of [-wheelOffset, wheelOffset]) {
    // Wheel shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(xOff, height / 2 + 2, wheelRadius, 0, Math.PI * 2);
    ctx.fill();

    // Tire with gradient
    const tireGradient = ctx.createRadialGradient(
      xOff, height / 2, wheelRadius * 0.3,
      xOff, height / 2, wheelRadius
    );
    tireGradient.addColorStop(0, '#333333');
    tireGradient.addColorStop(0.7, '#1a1a1a');
    tireGradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = tireGradient;
    ctx.beginPath();
    ctx.arc(xOff, height / 2, wheelRadius, 0, Math.PI * 2);
    ctx.fill();

    // Rim with metallic effect
    const rimGradient = ctx.createRadialGradient(
      xOff - wheelRadius * 0.1, height / 2 - wheelRadius * 0.1, 0,
      xOff, height / 2, wheelRadius * 0.6
    );
    rimGradient.addColorStop(0, '#aaaaaa');
    rimGradient.addColorStop(0.5, '#777777');
    rimGradient.addColorStop(1, '#555555');
    
    ctx.fillStyle = rimGradient;
    ctx.beginPath();
    ctx.arc(xOff, height / 2, wheelRadius * 0.55, 0, Math.PI * 2);
    ctx.fill();

    // Rim spokes
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.moveTo(xOff, height / 2);
      ctx.lineTo(
        xOff + Math.cos(angle) * wheelRadius * 0.4,
        height / 2 + Math.sin(angle) * wheelRadius * 0.4
      );
      ctx.stroke();
    }
  }

  // Add headlight
  ctx.fillStyle = 'rgba(255, 255, 200, 0.7)';
  ctx.beginPath();
  ctx.arc(width / 2 - 3, 0, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draw a rocket on the canvas
 * @param ctx - Canvas rendering context
 * @param x - X position (center)
 * @param y - Y position (center)
 * @param width - Rocket width in pixels
 * @param height - Rocket height in pixels
 * @param color - Rocket body color
 * @param rotation - Rotation angle in radians (0 = pointing up)
 */
export function drawRocket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  rotation: number = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Draw shadow based on rotation
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#000000';
  ctx.translate(4, 4);
  ctx.beginPath();
  ctx.moveTo(0, -height / 2);
  ctx.lineTo(width / 2, height / 2);
  ctx.lineTo(-width / 2, height / 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Draw flame/exhaust with dynamic glow
  const flameHeight = height * 0.4;
  
  // Outer flame glow
  const outerFlameGradient = ctx.createRadialGradient(
    0, height / 2 + flameHeight * 0.3, 0,
    0, height / 2 + flameHeight * 0.3, width * 0.8
  );
  outerFlameGradient.addColorStop(0, 'rgba(255, 150, 0, 0.8)');
  outerFlameGradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.4)');
  outerFlameGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
  
  ctx.fillStyle = outerFlameGradient;
  ctx.beginPath();
  ctx.moveTo(-width * 0.35, height / 2);
  ctx.quadraticCurveTo(0, height / 2 + flameHeight * 1.2, width * 0.35, height / 2);
  ctx.closePath();
  ctx.fill();

  // Inner flame core
  const flameGradient = ctx.createLinearGradient(0, height / 2, 0, height / 2 + flameHeight);
  flameGradient.addColorStop(0, '#FFEB3B');
  flameGradient.addColorStop(0.3, '#FF9800');
  flameGradient.addColorStop(0.7, '#FF5722');
  flameGradient.addColorStop(1, 'rgba(255, 87, 34, 0)');

  ctx.fillStyle = flameGradient;
  ctx.beginPath();
  ctx.moveTo(-width * 0.25, height / 2);
  ctx.quadraticCurveTo(-width * 0.1, height / 2 + flameHeight * 0.6, 0, height / 2 + flameHeight);
  ctx.quadraticCurveTo(width * 0.1, height / 2 + flameHeight * 0.6, width * 0.25, height / 2);
  ctx.closePath();
  ctx.fill();

  // Draw rocket body with metallic gradient
  const bodyGradient = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
  bodyGradient.addColorStop(0, shadeColor(color, -30));
  bodyGradient.addColorStop(0.3, shadeColor(color, 20));
  bodyGradient.addColorStop(0.5, color);
  bodyGradient.addColorStop(0.7, shadeColor(color, 20));
  bodyGradient.addColorStop(1, shadeColor(color, -30));
  
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.moveTo(0, -height / 2); // Tip
  ctx.lineTo(width / 2, height / 2); // Bottom right
  ctx.lineTo(-width / 2, height / 2); // Bottom left
  ctx.closePath();
  ctx.fill();

  // Add body outline with depth
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw body panels for detail
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const yPos = -height / 2 + (height * i) / 4;
    const xWidth = (width / 2) * (i / 4);
    ctx.beginPath();
    ctx.moveTo(-xWidth, yPos);
    ctx.lineTo(xWidth, yPos);
    ctx.stroke();
  }

  // Draw fins with gradient
  const finGradient = ctx.createLinearGradient(-width * 0.8, 0, -width / 2, 0);
  finGradient.addColorStop(0, shadeColor('#E63946', -20));
  finGradient.addColorStop(1, '#E63946');
  
  ctx.fillStyle = finGradient;
  // Left fin
  ctx.beginPath();
  ctx.moveTo(-width / 2, height * 0.2);
  ctx.lineTo(-width * 0.9, height / 2);
  ctx.lineTo(-width / 2, height / 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.stroke();

  // Right fin (mirror gradient)
  const finGradient2 = ctx.createLinearGradient(width * 0.8, 0, width / 2, 0);
  finGradient2.addColorStop(0, shadeColor('#E63946', -20));
  finGradient2.addColorStop(1, '#E63946');
  
  ctx.fillStyle = finGradient2;
  ctx.beginPath();
  ctx.moveTo(width / 2, height * 0.2);
  ctx.lineTo(width * 0.9, height / 2);
  ctx.lineTo(width / 2, height / 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.stroke();

  // Draw nose cone tip highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.moveTo(0, -height / 2);
  ctx.lineTo(width * 0.15, -height * 0.3);
  ctx.lineTo(-width * 0.05, -height * 0.25);
  ctx.closePath();
  ctx.fill();

  // Draw window/porthole with depth
  const windowY = -height * 0.15;
  const windowRadius = width * 0.18;
  
  // Window frame (darker)
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(0, windowY, windowRadius, 0, Math.PI * 2);
  ctx.fill();

  // Window glass with gradient
  const windowGradient = ctx.createRadialGradient(
    -windowRadius * 0.3, windowY - windowRadius * 0.3, 0,
    0, windowY, windowRadius
  );
  windowGradient.addColorStop(0, 'rgba(150, 200, 255, 0.8)');
  windowGradient.addColorStop(0.6, 'rgba(50, 100, 150, 0.6)');
  windowGradient.addColorStop(1, 'rgba(20, 40, 80, 0.9)');
  
  ctx.fillStyle = windowGradient;
  ctx.beginPath();
  ctx.arc(0, windowY, windowRadius * 0.85, 0, Math.PI * 2);
  ctx.fill();

  // Window highlight/reflection
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(-windowRadius * 0.35, windowY - windowRadius * 0.35, windowRadius * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Smaller secondary highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.arc(windowRadius * 0.2, windowY + windowRadius * 0.2, windowRadius * 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
