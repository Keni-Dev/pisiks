import { X } from 'lucide-react';
import { CollapsibleSection } from './ui/CollapsibleSection';

interface LearningPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LearningPanel({ isOpen, onClose }: LearningPanelProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-2xl font-bold text-white">Physics Concepts</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close learning panel"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-73px)] overflow-y-auto">
          <div className="p-6 space-y-4">
            <p className="text-gray-600 leading-relaxed">
              Welcome to the Physics Motion Simulator! This interactive tool helps you understand
              different types of motion through visualization and experimentation.
            </p>
          </div>

          <div className="border-t border-gray-200">
            <CollapsibleSection title="Uniform Motion" defaultOpen={true}>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Uniform motion</strong> occurs when an object moves with a constant velocity.
                  This means the object covers equal distances in equal intervals of time, with zero acceleration.
                </p>

                {/* Key Formulas */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-bold text-blue-900 mb-3 text-lg">📐 Key Formulas</h4>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-mono text-lg text-blue-900">s = ut</p>
                      <p className="text-sm text-gray-600 mt-1">Distance equals velocity times time</p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-mono text-lg text-blue-900">v = u = constant</p>
                      <p className="text-sm text-gray-600 mt-1">Velocity remains constant throughout</p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-mono text-lg text-blue-900">a = 0</p>
                      <p className="text-sm text-gray-600 mt-1">Acceleration is zero</p>
                    </div>
                  </div>
                </div>

                {/* Variable Explanations */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-bold text-purple-900 mb-3 text-lg">📚 Variable Explanations</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">s</span>
                      <div>
                        <p className="font-semibold text-purple-900">Distance (Displacement)</p>
                        <p className="text-sm text-gray-700">Total distance traveled by the object (measured in meters)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">u</span>
                      <div>
                        <p className="font-semibold text-purple-900">Initial Velocity</p>
                        <p className="text-sm text-gray-700">The constant speed at which the object moves (measured in m/s)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">v</span>
                      <div>
                        <p className="font-semibold text-purple-900">Final Velocity</p>
                        <p className="text-sm text-gray-700">Equal to initial velocity in uniform motion (measured in m/s)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">t</span>
                      <div>
                        <p className="font-semibold text-purple-900">Time</p>
                        <p className="text-sm text-gray-700">Duration of motion (measured in seconds)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">a</span>
                      <div>
                        <p className="font-semibold text-purple-900">Acceleration</p>
                        <p className="text-sm text-gray-700">Rate of change of velocity - always zero in uniform motion (measured in m/s²)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-World Examples */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-bold text-green-900 mb-3 text-lg">🌍 Real-World Examples</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-semibold text-green-900 mb-1">🚗 Highway Cruise</p>
                      <p className="text-sm text-gray-700">
                        A car traveling on a straight highway using cruise control at 60 mph. The car maintains
                        the same speed and covers equal distances every minute without speeding up or slowing down.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-semibold text-green-900 mb-1">🚂 Train on Straight Track</p>
                      <p className="text-sm text-gray-700">
                        A passenger train moving at a steady 100 km/h on a straight rail line. Each kilometer
                        takes exactly the same amount of time to traverse, demonstrating perfect uniform motion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Uniformly Accelerated Motion">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Uniformly accelerated motion</strong> (UAM) describes motion where an object's
                  velocity changes at a constant rate. The acceleration remains constant throughout the motion,
                  resulting in predictable changes in velocity and position over time.
                </p>

                {/* Key Formulas */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-bold text-blue-900 mb-3 text-lg">📐 Key Formulas</h4>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-mono text-lg text-blue-900">v = u + at</p>
                      <p className="text-sm text-gray-600 mt-1">Final velocity equals initial velocity plus acceleration times time</p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-mono text-lg text-blue-900">s = ut + ½at<sup>2</sup></p>
                      <p className="text-sm text-gray-600 mt-1">Distance formula incorporating initial velocity and acceleration</p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-mono text-lg text-blue-900">v<sup>2</sup> = u<sup>2</sup> + 2as</p>
                      <p className="text-sm text-gray-600 mt-1">Velocity-displacement relationship (time-independent)</p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-mono text-lg text-blue-900">s = ½(u + v)t</p>
                      <p className="text-sm text-gray-600 mt-1">Distance as average velocity times time</p>
                    </div>
                  </div>
                </div>

                {/* Variable Explanations */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-bold text-purple-900 mb-3 text-lg">📚 Variable Explanations</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">s</span>
                      <div>
                        <p className="font-semibold text-purple-900">Distance (Displacement)</p>
                        <p className="text-sm text-gray-700">Total distance traveled from starting point (measured in meters)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">u</span>
                      <div>
                        <p className="font-semibold text-purple-900">Initial Velocity</p>
                        <p className="text-sm text-gray-700">The starting speed of the object at time t=0 (measured in m/s)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">v</span>
                      <div>
                        <p className="font-semibold text-purple-900">Final Velocity</p>
                        <p className="text-sm text-gray-700">The speed of the object at any given time (measured in m/s)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">a</span>
                      <div>
                        <p className="font-semibold text-purple-900">Acceleration</p>
                        <p className="text-sm text-gray-700">Constant rate of change of velocity (measured in m/s²). Positive = speeding up, Negative = slowing down</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">t</span>
                      <div>
                        <p className="font-semibold text-purple-900">Time</p>
                        <p className="text-sm text-gray-700">Duration since the start of motion (measured in seconds)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-World Examples */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-bold text-green-900 mb-3 text-lg">🌍 Real-World Examples</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-semibold text-green-900 mb-1">🚦 Car Accelerating from a Stoplight</p>
                      <p className="text-sm text-gray-700">
                        When a traffic light turns green, a car accelerates from rest (u = 0) at a steady rate.
                        If it accelerates at 3 m/s², after 5 seconds it reaches 15 m/s and has traveled 37.5 meters.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-semibold text-green-900 mb-1">🎢 Ball Rolling Down an Incline</p>
                      <p className="text-sm text-gray-700">
                        A ball released from rest on a smooth ramp experiences constant acceleration due to
                        gravity's component along the slope. Its speed increases uniformly as it rolls downward.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Free Fall">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Free fall</strong> is a special case of uniformly accelerated motion where the
                  only force acting on an object is gravity. All objects in free fall experience the same
                  downward acceleration (g ≈ 9.81 m/s²) regardless of their mass, shape, or size.
                </p>

                {/* Key Formulas */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-bold text-blue-900 mb-3 text-lg">📐 Key Formulas</h4>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-mono text-lg text-blue-900">v = u + gt</p>
                      <p className="text-sm text-gray-600 mt-1">Velocity increases by 9.81 m/s every second (downward positive)</p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-mono text-lg text-blue-900">s = ut + ½gt<sup>2</sup></p>
                      <p className="text-sm text-gray-600 mt-1">Vertical distance fallen under gravity's influence</p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-mono text-lg text-blue-900">v<sup>2</sup> = u<sup>2</sup> + 2gs</p>
                      <p className="text-sm text-gray-600 mt-1">Relates velocity to height without needing time</p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-mono text-lg text-blue-900">g = 9.81 m/s<sup>2</sup></p>
                      <p className="text-sm text-gray-600 mt-1">Acceleration due to Earth's gravity (constant near surface)</p>
                    </div>
                  </div>
                </div>

                {/* Variable Explanations */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-bold text-purple-900 mb-3 text-lg">📚 Variable Explanations</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">s</span>
                      <div>
                        <p className="font-semibold text-purple-900">Vertical Distance (Height)</p>
                        <p className="text-sm text-gray-700">Vertical displacement from starting point (measured in meters)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">u</span>
                      <div>
                        <p className="font-semibold text-purple-900">Initial Velocity</p>
                        <p className="text-sm text-gray-700">Starting vertical speed - zero if dropped, positive if thrown upward (measured in m/s)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">v</span>
                      <div>
                        <p className="font-semibold text-purple-900">Final Velocity</p>
                        <p className="text-sm text-gray-700">Vertical speed at any point during fall (measured in m/s)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">g</span>
                      <div>
                        <p className="font-semibold text-purple-900">Gravitational Acceleration</p>
                        <p className="text-sm text-gray-700">Earth's constant downward acceleration = 9.81 m/s² (can use 10 m/s² for approximations)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-purple-900 text-lg min-w-[2rem]">t</span>
                      <div>
                        <p className="font-semibold text-purple-900">Time</p>
                        <p className="text-sm text-gray-700">Duration of fall or time in air (measured in seconds)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-World Examples */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-bold text-green-900 mb-3 text-lg">🌍 Real-World Examples</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-semibold text-green-900 mb-1">🍎 Apple Falling from a Tree</p>
                      <p className="text-sm text-gray-700">
                        When an apple detaches from a tree branch, it falls freely under gravity's pull.
                        Starting from rest, after 1 second it's moving at 9.81 m/s downward and has fallen about 4.9 meters.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-semibold text-green-900 mb-1">🏛️ Galileo's Tower of Pisa Experiment</p>
                      <p className="text-sm text-gray-700">
                        Galileo famously demonstrated that objects of different masses fall at the same rate.
                        Whether dropping a cannonball or a musket ball, both hit the ground simultaneously
                        when released from the same height (ignoring air resistance).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fun Fact */}
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <p className="font-bold text-yellow-900 mb-2">💡 Amazing Fact</p>
                  <p className="text-sm text-yellow-900">
                    In a vacuum (no air resistance), a feather and a hammer fall at exactly the same rate!
                    This was famously demonstrated on the Moon by Apollo 15 astronaut David Scott in 1971,
                    proving Galileo's theory in front of the whole world.
                  </p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Projectile Motion">
              <div className="space-y-3">
                <p>
                  <strong>Projectile motion</strong> is two-dimensional motion under the influence of
                  gravity. It combines horizontal uniform motion with vertical free fall motion.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-2">Key Characteristics:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>Parabolic trajectory path</li>
                    <li>Horizontal velocity remains constant (no air resistance)</li>
                    <li>Vertical motion follows free fall equations</li>
                    <li>Independent horizontal and vertical components</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="font-semibold text-purple-900 mb-2">Component Equations:</p>
                  <p className="text-purple-800 text-sm mb-2">Horizontal (x):</p>
                  <ul className="space-y-1 text-purple-800 font-mono text-sm mb-3">
                    <li>vₓ = v₀·cos(θ) = constant</li>
                    <li>x = v₀·cos(θ)·t</li>
                  </ul>
                  <p className="text-purple-800 text-sm mb-2">Vertical (y):</p>
                  <ul className="space-y-1 text-purple-800 font-mono text-sm">
                    <li>vᵧ = v₀·sin(θ) - g·t</li>
                    <li>y = v₀·sin(θ)·t - ½·g·t²</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">Important Values:</p>
                  <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                    <li>Maximum height: H = (v₀·sin(θ))² / (2g)</li>
                    <li>Time of flight: T = 2·v₀·sin(θ) / g</li>
                    <li>Range: R = v₀²·sin(2θ) / g</li>
                    <li>Optimal angle for max range: 45°</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Real-world example:</strong> A basketball shot, a soccer ball kicked at an angle,
                  water from a fountain, a cannonball fired from a cannon.
                </p>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Understanding the Graphs">
              <div className="space-y-3">
                <p>
                  The simulator displays three key graphs that help visualize the motion:
                </p>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-semibold text-blue-900 mb-2">Position vs. Time</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                      <li><strong>Slope:</strong> Represents velocity</li>
                      <li><strong>Horizontal line:</strong> Object at rest</li>
                      <li><strong>Straight diagonal:</strong> Constant velocity (uniform motion)</li>
                      <li><strong>Curved line:</strong> Changing velocity (acceleration)</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-semibold text-green-900 mb-2">Velocity vs. Time</p>
                    <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                      <li><strong>Slope:</strong> Represents acceleration</li>
                      <li><strong>Horizontal line:</strong> Constant velocity</li>
                      <li><strong>Diagonal line:</strong> Constant acceleration</li>
                      <li><strong>Area under curve:</strong> Total displacement</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="font-semibold text-purple-900 mb-2">Acceleration vs. Time</p>
                    <ul className="list-disc list-inside space-y-1 text-purple-800 text-sm">
                      <li><strong>Horizontal line:</strong> Constant acceleration (UAM)</li>
                      <li><strong>Zero line:</strong> No acceleration (uniform motion)</li>
                      <li><strong>Area under curve:</strong> Change in velocity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Tips for Using the Simulator">
              <div className="space-y-3">
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    <strong>Try different presets:</strong> Start with the preset scenarios to see how
                    each type of motion behaves.
                  </li>
                  <li>
                    <strong>Adjust parameters:</strong> Change initial position, velocity, and acceleration
                    to see how they affect the motion.
                  </li>
                  <li>
                    <strong>Watch the graphs:</strong> Observe how position, velocity, and acceleration
                    graphs relate to each other in real-time.
                  </li>
                  <li>
                    <strong>Use pause and reset:</strong> Pause at key moments to analyze the motion,
                    or reset to try different values.
                  </li>
                  <li>
                    <strong>Take screenshots:</strong> Use the screenshot feature in the data panel
                    to save interesting motion patterns.
                  </li>
                  <li>
                    <strong>Compare motions:</strong> Run different scenarios and compare the graphs
                    to understand the differences.
                  </li>
                </ul>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </>
  );
}
