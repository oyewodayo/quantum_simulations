# Quantum Explorer · CERN

An interactive quantum computing simulation platform that visualizes quantum mechanics concepts through intuitive comparisons with classical systems. Built with pure JavaScript, HTML, and CSS.

## 🌟 Overview

Quantum Explorer transforms complex quantum mechanics into interactive visual experiences. From qubit superposition and quantum gates to entanglement and wave interference, this platform makes quantum concepts tangible through real-time visualization and hands-on experimentation.

## ✨ Features

### 🎯 Qubit Explorer
- **Classical vs Quantum Comparison**: Side-by-side interaction with classical bits and qubits
- **Bloch Sphere Visualization**: Real-time 3D state representation with smooth animations
- **State Vector Display**: Visualize probability amplitudes and superposition
- **Preset States**: Quick-switch between |0⟩, |1⟩, |+⟩, |-⟩, |i⟩, |-i⟩

### 🎮 Quantum Gates
- **All Standard Gates**: H, X, Y, Z, S, T gates with visual feedback
- **Gate Matrix Display**: See the mathematical representation of each operation
- **Applied Sequence History**: Track the gate sequence applied to the qubit
- **Live State Updates**: Watch the Bloch sphere rotate in real-time

### 🔬 Quantum Circuit Builder
- **Drag-and-Drop Gate Palette**: Build custom quantum circuits
- **Visual Circuit Representation**: See gates arranged along a quantum wire
- **Circuit Execution**: Run the circuit step-by-step with animations
- **State Evolution**: Track the qubit's state as it moves through the circuit

### 📊 Measurement & Statistics
- **Single Measurement**: Collapse superposition and observe the result
- **Batch Measurement**: Run 10, 100, or 1000 measurements to see statistical convergence
- **Histogram Visualization**: Watch probability distribution emerge from repeated measurements
- **Quantum vs Classical**: Compare deterministic vs probabilistic outcomes

### 🔗 Entanglement
- **Bell State Simulation**: Visualize the (|00⟩ + |11⟩)/√2 entangled state
- **Instantaneous Correlation**: Measure one qubit and see the other collapse simultaneously
- **Statistics Tracking**: Observe the perfect correlation between entangled qubits
- **Interactive Coins**: Visual representation of qubit states with flip animations

### 🌊 Wave Phenomena
- **Quantum Tunneling**: Watch wave packets pass through classically forbidden barriers
- **Real-Time Schrödinger Solver**: Physics-based simulation, not just animation
- **Wave Interference**: Double-slit experiment with particle-by-particle accumulation
- **Which-Path Detection**: See interference disappear when path information is available

### 📐 State Vector Visualization
- **Classical vs Quantum State Space**: Visual comparison of discrete vs continuous states
- **2D Complex Plane**: See α|0⟩ + β|1⟩ represented geometrically
- **Probability Bars**: Real-time amplitude visualization

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- No additional dependencies or installations required

### Installation
1. Clone the repository:
```bash
git clone [repository-url]
cd quantum-explorer
```

2. Open `index.html` in your browser:
```bash
# Or simply double-click the file
open index.html
```

### File Structure
```
quantum-explorer/
├── index.html          # Main HTML file with all tabs and UI
├── css/
│   └── style.css       # Complete styling with dark/light theme
└── js/
    └── main.js         # Quantum simulation engine and UI logic
```

## 🎯 How It Works

### Quantum Engine
The simulation uses a complete quantum state vector representation:
- Qubit state: |ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1
- Complex arithmetic for accurate gate operations
- Real-time Bloch sphere rendering with smooth animations
- Physics-based simulations (Schrödinger equation for tunneling)

### Rendering Pipeline
- **Bloch Renderer**: 3D projection with perspective and depth cues
- **Theme-Aware**: Automatic dark/light mode adaptation
- **Smooth Animations**: Interpolated transitions between states
- **Canvas-Based**: GPU-accelerated graphics for performance

### User Experience
- **Tab-Based Navigation**: Organizes concepts into clear sections
- **Responsive Design**: Works on desktop and tablet
- **Interactive Controls**: Sliders, buttons, and click interactions
- **Explanatory Text**: Each interaction provides educational context

## 🧪 Interactive Examples

### Explore Superposition
1. Open the **Qubit** tab
2. Drag the θ and φ sliders
3. Watch the Bloch sphere arrow move to any point
4. See the probability bars update in real-time

### Build a Circuit
1. Go to the **Circuit** tab
2. Click gates in the palette to add them
3. Press **Run** to execute
4. Watch the state evolve step-by-step

### Test Tunneling
1. Navigate to the **Tunnel** tab
2. Adjust barrier height (V₀) and width
3. Watch the wave packet approach
4. See the transmitted probability on the right

### Observe Interference
1. Open the **Interference** tab
2. Choose **Double Slit** mode
3. Watch individual dots accumulate
4. Switch to **Which-Path** to see the pattern vanish

## 🎨 Theme

The interface supports both light and dark themes:
- **Light Theme**: Clean, bright, ideal for presentations
- **Dark Theme**: Immersive, reduces eye strain
- **Automatic Toggle**: Click the moon/sun icon in the header

## 🔧 Technical Details

### Core Technologies
- **HTML5**: Semantic structure with custom data attributes
- **CSS3**: CSS custom properties for theming, flexbox/grid layout
- **Vanilla JavaScript**: No external libraries or frameworks
- **Canvas API**: All visualizations rendered on canvas elements

### Quantum Simulation
- **State Representation**: Complex numbers with real/imaginary parts
- **Gate Operations**: Matrix multiplication on 2D complex vectors
- **Bloch Sphere**: Spherical coordinates with 3D projection
- **Schrödinger Equation**: Finite-difference method for tunneling
- **Rejection Sampling**: Accurate interference pattern generation

### Performance Optimizations
- **Animation Throttling**: Only active tabs consume resources
- **Canvas Efficient**: Pixel manipulation for wave rendering
- **Minimal DOM Updates**: Batched state updates

## 📚 Educational Value

This tool is designed for:
- **Students**: Learn quantum computing concepts visually
- **Educators**: Demonstrate quantum phenomena in lectures
- **Enthusiasts**: Explore quantum mechanics interactively
- **Researchers**: Quick prototyping of quantum concepts

### Key Concepts Covered
- Superposition and basis states
- Unitary transformations and quantum gates
- Measurement and wavefunction collapse
- Entanglement and non-locality
- Quantum tunneling and barrier penetration
- Wave interference and the double-slit experiment
- The measurement problem in quantum mechanics

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue with detailed steps
2. **Suggest Features**: Share ideas for new visualizations
3. **Improve Documentation**: Clarify concepts or add examples
4. **Enhance Code**: Optimize performance or fix issues

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test across different browsers
- Update README for significant changes

## 📄 License

Copyright © CERN

## 🙏 Acknowledgments

- CERN for hosting and supporting this educational initiative
- The quantum computing community for inspiration and concepts
- All contributors and testers who helped refine the experience

---

## 🌐 Explore More

- **Quantum Computing**: Learn about qubits, gates, and algorithms
- **CERN**: Discover the world's leading particle physics laboratory
- **Quantum Education**: Resources for learning quantum mechanics

---

**Experience quantum mechanics like never before — interact, visualize, and understand.**