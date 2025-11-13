# Geometric Shapes

## Project Structure

```
.
├── src/
│   ├── entities/          # Entity classes (data only)
│   │   ├── Point.ts
│   │   ├── Shape.ts
│   │   ├── Triangle.ts
│   │   └── Sphere.ts
│   ├── factories/         # Factories (Factory Method pattern)
│   │   ├── ShapeFactory.ts
│   │   ├── TriangleFactory.ts
│   │   └── SphereFactory.ts
│   ├── services/          # Business logic
│   │   ├── TriangleService.ts
│   │   └── SphereService.ts
│   ├── validators/        # Validators
│   │   ├── PointValidator.ts
│   │   ├── TriangleValidator.ts
│   │   └── SphereValidator.ts
│   ├── exceptions/        # Custom exceptions
│   │   ├── CustomException.ts
│   │   ├── ValidationException.ts
│   │   ├── ParseException.ts
│   │   └── ShapeCreationException.ts
│   ├── utils/            # Utilities
│   │   ├── logger.ts
│   │   └── FileParser.ts
│   └── index.ts          # Main application file
├── tests/                # Unit tests
├── data/                 # Data files
│   ├── triangles.txt
│   └── spheres.txt
└── logs/                 # Application logs
```

# Quick Start

## Installation and Run

```bash
npm install              # Install dependencies
npm test                 # Run tests
npm run dev              # Run application
```

## Data Format

### Triangle (9 numbers)
```
x1 y1 z1 x2 y2 z2 x3 y3 z3
```

Example:
```
0 0 0 3 0 0 0 4 0
1 1 1 4 1 1 1 5 1
```

### Sphere (4 numbers)
```
centerX centerY centerZ radius
```

Example:
```
0 0 0 5
1 2 3 4.5
```

## Files
- `data/triangles.txt` - triangle data
- `data/spheres.txt` - sphere data  
- `logs/app.log` - application logs

## Available Scripts

```bash
npm run dev              # Development mode (ts-node)
npm run build            # Build TypeScript to JavaScript
npm start                # Run production build
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run lint             # Check code style
npm run lint:fix         # Auto-fix code style issues
```

