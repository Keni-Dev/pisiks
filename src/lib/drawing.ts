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

  // Draw main ball
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fill();

  // Add highlight for 3D effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.arc(-radius * 0.25, -radius * 0.25, radius * 0.25, 0, Math.PI * 2);
  ctx.fill();

  // Add subtle outline
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.restore();
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

  const cornerRadius = 3;
  const wheelRadius = height * 0.25;
  const wheelOffset = width * 0.3;

  // Draw car body with rounded corners
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-width / 2 + cornerRadius, -height / 2);
  ctx.arcTo(width / 2, -height / 2, width / 2, height / 2, cornerRadius);
  ctx.arcTo(width / 2, height / 2, -width / 2, height / 2, cornerRadius);
  ctx.arcTo(-width / 2, height / 2, -width / 2, -height / 2, cornerRadius);
  ctx.arcTo(-width / 2, -height / 2, width / 2, -height / 2, cornerRadius);
  ctx.closePath();
  ctx.fill();

  // Add car body outline
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw windshield
  ctx.fillStyle = 'rgba(100, 150, 200, 0.4)';
  ctx.fillRect(-width * 0.25, -height * 0.35, width * 0.5, height * 0.3);

  // Draw wheels
  ctx.fillStyle = '#222222';
  ctx.beginPath();
  ctx.arc(-wheelOffset, height / 2, wheelRadius, 0, Math.PI * 2);
  ctx.arc(wheelOffset, height / 2, wheelRadius, 0, Math.PI * 2);
  ctx.fill();

  // Draw wheel rims
  ctx.fillStyle = '#666666';
  ctx.beginPath();
  ctx.arc(-wheelOffset, height / 2, wheelRadius * 0.5, 0, Math.PI * 2);
  ctx.arc(wheelOffset, height / 2, wheelRadius * 0.5, 0, Math.PI * 2);
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

  // Draw rocket body (main cone)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -height / 2); // Tip
  ctx.lineTo(width / 2, height / 2); // Bottom right
  ctx.lineTo(-width / 2, height / 2); // Bottom left
  ctx.closePath();
  ctx.fill();

  // Add body outline
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Draw fins (wings)
  ctx.fillStyle = '#E63946';
  ctx.beginPath();
  // Left fin
  ctx.moveTo(-width / 2, height * 0.2);
  ctx.lineTo(-width * 0.8, height / 2);
  ctx.lineTo(-width / 2, height / 2);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  // Right fin
  ctx.moveTo(width / 2, height * 0.2);
  ctx.lineTo(width * 0.8, height / 2);
  ctx.lineTo(width / 2, height / 2);
  ctx.closePath();
  ctx.fill();

  // Draw window/porthole
  ctx.fillStyle = '#2B2D42';
  ctx.beginPath();
  ctx.arc(0, -height * 0.15, width * 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Window highlight
  ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
  ctx.beginPath();
  ctx.arc(-width * 0.05, -height * 0.2, width * 0.08, 0, Math.PI * 2);
  ctx.fill();

  // Draw flame/exhaust when applicable (optional - can be controlled by caller)
  // For now, always draw a small flame at the bottom
  const flameHeight = height * 0.3;
  const flameGradient = ctx.createLinearGradient(0, height / 2, 0, height / 2 + flameHeight);
  flameGradient.addColorStop(0, '#FF6B35');
  flameGradient.addColorStop(0.5, '#F7931E');
  flameGradient.addColorStop(1, 'rgba(255, 107, 53, 0)');

  ctx.fillStyle = flameGradient;
  ctx.beginPath();
  ctx.moveTo(-width * 0.2, height / 2);
  ctx.lineTo(0, height / 2 + flameHeight);
  ctx.lineTo(width * 0.2, height / 2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
