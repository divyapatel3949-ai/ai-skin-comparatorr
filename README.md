# SkinTone AI – Photo Skin Tone Comparator

A client-side web application that allows users to upload photos of two people, analyze the visible skin color in selected regions using the HTML5 Canvas API and CIELAB color space, and display a detailed side-by-side comparison with numerical values and a percentage difference in measured skin lightness.

All processing occurs entirely inside the user's browser — no images are ever sent to an external server or third-party API.

---

## Features

- **Client-Side Image Processing:** Direct pixel analysis via HTML5 Canvas API with no external network latency or privacy risks.
- **Drag & Drop Upload:** Separate upload cards for Person A and Person B supporting JPG, JPEG, PNG, and WEBP formats with a 10 MB limit and dimension validation.
- **Interactive Region Selection:** Custom bounding-box selector with real-time preview, zoom controls, and manual coordinate clamping.
- **Automatic Skin Detection Heuristic:** Color-based heuristic adapted from skin detection literature to identify skin pixel clusters automatically.
- **Rigorous Color Science:**
  - Standard sRGB linearization (inverse companding function)
  - Linear RGB to CIE 1931 XYZ using D65 reference illuminant
  - XYZ to CIELAB ($L^*, a^*, b^*$) conversion
  - Outlier filtering (5% trimmed mean/median) to reject highlights, shadows, and non-skin pixels
- **Relative Lightness Calculator:**
  - $L^*$ perceptual lightness difference calculated using the lower positive reference:
    $$\Delta L^* (\%) = \left(\frac{L_{\text{higher}} - L_{\text{lower}}}{L_{\text{lower}}}\right) \times 100$$
  - Handles equal values ($0.0\%$) and zero/near-zero denominators safely without `NaN` or `Infinity`.
  - Symmetric and directional: swapping Person A and Person B reverses comparison direction cleanly.
- **Results Dashboard:**
  - Prominent percentage difference and interpretation card
  - Side-by-side comparison cards with sampled hex swatches, median $L^*, a^*, b^*$, and RGB values
  - Shared horizontal $L^*$ comparison scale (0–100)
  - Copyable hex codes and quality warnings (clipping, underexposure, color cast)
- **Privacy & Ethics First:** Explicit disclaimers clarifying that measurements reflect visible image pixels under camera/lighting conditions and are not measures of natural fairness, beauty, ethnicity, or worth.

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Unit Testing:** Vitest

---

## Project Structure

```
c:\SkinToneComparator\
├── src/
│   ├── components/
│   │   ├── AnalysisProgress.tsx       # Loading indicator for canvas processing
│   │   ├── ComparisonSummary.tsx      # Main percentage difference card & explanation
│   │   ├── Footer.tsx                 # Site footer with disclaimer
│   │   ├── Header.tsx                 # Sticky navigation and CTA
│   │   ├── Hero.tsx                   # Hero section with quick intro
│   │   ├── HowItWorks.tsx             # 3-step usage guide and photography tips
│   │   ├── ImageUploadCard.tsx        # Drag-and-drop file upload with preview
│   │   ├── LightnessComparisonBar.tsx # Horizontal 0–100 CIELAB L* scale
│   │   ├── PrivacyNotice.tsx          # Privacy assurances and security details
│   │   ├── ResultsDashboard.tsx       # Comprehensive results overview
│   │   ├── SkinRegionSelector.tsx     # Canvas region selection & auto-detector
│   │   └── SkinToneSwatch.tsx         # Color swatch with clipboard copy
│   ├── hooks/
│   │   ├── useImageUpload.ts          # File upload & object URL lifecycle hook
│   │   └── useSkinToneAnalysis.ts     # Analysis and comparison state hook
│   ├── types/
│   │   └── index.ts                   # Core interfaces and data structures
│   ├── utils/
│   │   ├── colorConversion.ts         # sRGB -> Linear RGB -> XYZ -> CIELAB pipeline
│   │   ├── comparisonCalculator.ts    # Relative lightness % formulas
│   │   ├── imageProcessing.ts         # Canvas pixel extraction & statistics
│   │   ├── skinDetection.ts           # Skin heuristic and quality checks
│   │   └── validation.ts              # File type, size, and dimension checks
│   ├── App.tsx                        # Main application orchestrator
│   ├── main.tsx                       # React DOM entry point
│   └── index.css                      # Tailwind CSS v4 styling
├── tests/
│   ├── colorConversion.test.ts        # Synthetic color conversion test suite
│   └── comparisonCalculator.test.ts   # Percentage comparison cases & symmetry tests
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone or navigate to the project directory
cd c:\SkinToneComparator

# Install dependencies
npm install
```

### Running Locally (Development)

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Running Unit Tests

```bash
npm test
```

### Production Build

```bash
npm run build
```

The compiled assets will be placed in the `dist/` directory.

---

## Mathematical Details & Color Science

1. **sRGB Linearization:**
   $$C_{\text{linear}} = \begin{cases} \frac{C_{\text{sRGB}}}{12.92} & \text{if } C_{\text{sRGB}} \le 0.04045 \\ \left(\frac{C_{\text{sRGB}} + 0.055}{1.055}\right)^{2.4} & \text{otherwise} \end{cases}$$

2. **CIE 1931 XYZ (D65 Illuminant):**
   Standard transformation matrix converting linear $[R, G, B]^T$ to $[X, Y, Z]^T$.

3. **CIELAB Conversion:**
   Uses standard non-linear cube root companding relative to reference white $X_n=95.047, Y_n=100.000, Z_n=108.883$ to derive $L^*$ ($0$ = absolute black, $100$ = reference diffuse white).

4. **Relative Lightness Calculation:**
   Using the lower positive $L^*$ value as the denominator ensures that the percentage difference is always positive and normalized against the darker sampled reference:
   $$\text{Relative Difference} = \frac{L_{\text{max}} - L_{\text{min}}}{L_{\text{min}}} \times 100\%$$
