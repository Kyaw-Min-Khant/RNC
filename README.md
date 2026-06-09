# RNC - React Native Components

A React Native UI library with **StyleSheet** and **Tailwind (NativeWind)** support—like React Native Paper.

## Installation

```bash
npm install rnc
# or
yarn add rnc
# or
pnpm add rnc
```

## Setup

### 1. Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from 'rnc';

export default function App() {
  return (
    <ThemeProvider
      theme={{
        colors: {
          primary: '#6200ee',
          secondary: '#03dac6',
        },
        roundness: 8,
      }}
    >
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. (Optional) NativeWind / Tailwind setup

If you use [NativeWind](https://www.nativewind.dev/), add this to your app entry (e.g. `App.tsx`):

```tsx
import { remapProps } from 'nativewind';
import { Button } from 'rnc';

remapProps(Button, {
  className: 'style',
  textClassName: 'textStyle',
});
```

## Usage

### With StyleSheet

```tsx
import { Button } from 'rnc';

<Button
  title="Press me"
  onPress={() => {}}
  variant="primary"
  style={{ marginTop: 16 }}
  textStyle={{ fontSize: 18 }}
/>
```

### With Tailwind (NativeWind)

```tsx
import { Button } from 'rnc';

<Button
  title="Press me"
  onPress={() => {}}
  variant="primary"
  className="mt-4 rounded-full"
  textClassName="font-bold"
/>
```

### Mix both

```tsx
<Button
  title="Submit"
  onPress={handleSubmit}
  style={{ width: '100%' }}
  className="bg-blue-500"
/>
```

## Components

### Button

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Button text |
| `onPress` | `() => void` | Press handler |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | Button style |
| `disabled` | `boolean` | Disabled state |
| `loading` | `boolean` | Loading state |
| `style` | `ViewStyle` | StyleSheet styles |
| `textStyle` | `TextStyle` | StyleSheet text styles |
| `className` | `string` | Tailwind classes (NativeWind) |
| `textClassName` | `string` | Tailwind text classes (NativeWind) |

## Utilities

### cn()

Merge class names for Tailwind:

```tsx
import { cn } from 'rnc';

<View className={cn('p-4', isActive && 'bg-blue-500', className)} />
```
