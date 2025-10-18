# @tortoise-os/ui ✨🐢

> Magic UI components for TortoiseOS - Beautiful, animated React components powered by Framer Motion

## 📦 Installation

```bash
# bun (recommended)
bun add @tortoise-os/ui

# npm
npm install @tortoise-os/ui
```

## 🎨 What's Inside

A collection of 25+ beautifully animated components from [Magic UI](https://magicui.design/), optimized for TortoiseOS projects.

### 🌟 Featured Components

#### Backgrounds & Effects
- **RetroGrid** - Nostalgic retro grid background
- **AnimatedGridPattern** - Dynamic grid pattern with animations
- **Particles** - Interactive particle effects
- **Ripple** - Water ripple effect
- **Meteors** - Shooting star effects

#### Text Animations
- **SparklesText** - Text with sparkle effects
- **HyperText** - Cyberpunk-style glitch text
- **FadeText** - Smooth fade-in text
- **TypingAnimation** - Typewriter effect
- **WordRotate** - Rotating word carousel

#### Interactive Components
- **BorderBeam** - Animated border glow
- **BlurFade** - Smooth blur fade-in
- **MagicCard** - Card with magical hover effect
- **Dock** - macOS-style dock navigation
- **Orbit** - Circular orbit animation

#### Buttons
- **RainbowButton** - Button with rainbow gradient
- **ShimmerButton** - Shimmering button effect
- **ShinyButton** - Metallic shine button

#### Other
- **AnimatedBeam** - Connecting line animations
- **BentoGrid** - Modern bento box layout
- **Marquee** - Infinite scroll marquee
- **NumberTicker** - Animated number counter
- **AvatarCircles** - Stacked avatar circles

## 🚀 Quick Start

```typescript
import { SparklesText, RainbowButton, RetroGrid } from '@tortoise-os/ui';

function App() {
  return (
    <div className="relative min-h-screen">
      <RetroGrid />
      <div className="relative z-10">
        <SparklesText text="Welcome to TortoiseOS" />
        <RainbowButton onClick={() => console.log('Clicked!')}>
          Get Started
        </RainbowButton>
      </div>
    </div>
  );
}
```

## 📚 Component Examples

### Sparkles Text
```typescript
import { SparklesText } from '@tortoise-os/ui';

<SparklesText
  text="Magical Text"
  colors={{ first: "#9E7AFF", second: "#FE8BBB" }}
/>
```

### Rainbow Button
```typescript
import { RainbowButton } from '@tortoise-os/ui';

<RainbowButton onClick={handleClick}>
  Click Me!
</RainbowButton>
```

### Retro Grid Background
```typescript
import { RetroGrid } from '@tortoise-os/ui';

<div className="relative h-screen">
  <RetroGrid />
  <div className="relative z-10">
    {/* Your content */}
  </div>
</div>
```

### Animated Grid Pattern
```typescript
import { AnimatedGridPattern } from '@tortoise-os/ui';

<AnimatedGridPattern
  numSquares={30}
  maxOpacity={0.1}
  duration={3}
  className="fixed inset-0"
/>
```

### Border Beam
```typescript
import { BorderBeam } from '@tortoise-os/ui';

<div className="relative rounded-lg border">
  <BorderBeam size={250} duration={12} delay={9} />
  <div className="p-8">Card content</div>
</div>
```

### Number Ticker
```typescript
import { NumberTicker } from '@tortoise-os/ui';

<NumberTicker
  value={1000000}
  className="text-4xl font-bold"
/>
```

### Dock Navigation
```typescript
import { Dock } from '@tortoise-os/ui';

<Dock>
  <Dock.Item icon={HomeIcon} href="/" label="Home" />
  <Dock.Item icon={WalletIcon} href="/wallet" label="Wallet" />
  <Dock.Item icon={SwapIcon} href="/swap" label="Swap" />
</Dock>
```

## 🎨 Styling

All components are built with:
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **CVA** - Class variance authority for variants

### Required Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        // ... more animations
      },
    },
  },
};
```

## 🔧 TypeScript Support

Full TypeScript support with exported types:

```typescript
import type { SparklesTextProps, BorderBeamProps } from '@tortoise-os/ui';
```

## 🎯 Usage in TortoiseOS

Perfect for:
- Landing pages
- DeFi dashboards
- NFT galleries
- Wallet interfaces
- Marketing pages

## 📖 Component API

### Common Props

Most components support:
- `className` - Tailwind classes
- `style` - Inline styles
- Standard React props

See individual component files in `src/components/` for detailed prop types.

## 🌈 Customization

```typescript
// Custom colors
<SparklesText
  text="Custom"
  colors={{
    first: "#ff0000",
    second: "#00ff00"
  }}
/>

// Custom animation duration
<BorderBeam duration={20} delay={5} />

// Custom sizing
<Particles className="h-full" quantity={100} />
```

## 🤝 Contributing

These components are from [Magic UI](https://magicui.design/). For bugs or improvements specific to TortoiseOS integration, open an issue.

## 📄 License

MIT © TortoiseOS Team

Original components © Magic UI

## 🔗 Links

- [Magic UI Documentation](https://magicui.design/)
- [TortoiseOS](https://github.com/tortoise-os/bun-move)
- [Framer Motion](https://www.framer.com/motion/)
- [Report Issues](https://github.com/tortoise-os/bun-move/issues)

---

**Make your Sui dApps magical** ✨🐢

Built with Framer Motion, styled with Tailwind CSS.
