# RNC — React Native Components

A lightweight React Native UI library with full **StyleSheet** and **NativeWind (Tailwind)** support. Every component is theme-aware — customize colors and roundness once via `ThemeProvider` and all components update automatically.

---

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Theme](#theme)
- [Components](#components)
  - [Button](#button)
  - [Input](#input)
  - [Badge](#badge)
  - [Dropdown](#dropdown)
  - [FloatingActionButton](#floatingactionbutton)
- [Utilities](#utilities)

---

## Installation

```bash
npm install @kyaw-min-khant/rnc
# or
yarn add @kyaw-min-khant/rnc
```

---

## Setup

Wrap your root component with `ThemeProvider`. You can pass a partial theme — anything you omit falls back to the default.

```tsx
import { ThemeProvider } from '@kyaw-min-khant/rnc';

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

---

## Theme

### `RNCTheme` interface

| Token | Default | Description |
|---|---|---|
| `colors.primary` | `#6200ee` | Main brand color |
| `colors.secondary` | `#03dac6` | Secondary brand color |
| `colors.background` | `#ffffff` | Screen background |
| `colors.surface` | `#f5f5f5` | Card / input background |
| `colors.error` | `#b00020` | Error states |
| `colors.success` | `#388e3c` | Success states |
| `colors.warning` | `#f57c00` | Warning states |
| `colors.onPrimary` | `#ffffff` | Text/icon on primary bg |
| `colors.onSecondary` | `#000000` | Text/icon on secondary bg |
| `colors.onSurface` | `#000000` | Text/icon on surface |
| `colors.outline` | `#6200ee` | Borders and outlines |
| `roundness` | `8` | Border radius for all components |

### `useTheme()`

Access the active theme inside your own components:

```tsx
import { useTheme } from '@kyaw-min-khant/rnc';

function MyComponent() {
  const theme = useTheme();
  return <View style={{ backgroundColor: theme.colors.surface }} />;
}
```

---

## Components

### Button

```tsx
import { Button } from '@kyaw-min-khant/rnc';

<Button title="Submit" onPress={() => {}} />
<Button title="Secondary" onPress={() => {}} variant="secondary" />
<Button title="Outline" onPress={() => {}} variant="outline" />
<Button title="Ghost" onPress={() => {}} variant="ghost" />
<Button title="Loading" onPress={() => {}} loading />
<Button title="Disabled" onPress={() => {}} disabled />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Button label |
| `onPress` | `() => void` | — | Press handler |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Visual style |
| `disabled` | `boolean` | `false` | Disables interaction |
| `loading` | `boolean` | `false` | Shows spinner, disables interaction |
| `style` | `ViewStyle` | — | Extra container styles |
| `textStyle` | `TextStyle` | — | Extra text styles |
| `className` | `string` | — | NativeWind classes |
| `textClassName` | `string` | — | NativeWind text classes |

---

### Input

```tsx
import { Input } from '@kyaw-min-khant/rnc';

<Input label="Email" placeholder="you@example.com" />
<Input label="Filled" variant="filled" placeholder="..." />
<Input label="Underlined" variant="underlined" placeholder="..." />
<Input label="With error" placeholder="..." error="This field is required" />
<Input
  label="With icons"
  placeholder="Search..."
  leftIcon={<SearchIcon />}
  rightIcon={<CloseIcon />}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Label above the input |
| `error` | `string` | — | Error message below the input |
| `variant` | `'outlined' \| 'filled' \| 'underlined'` | `'outlined'` | Border style |
| `leftIcon` | `ReactNode` | — | Icon on the left side |
| `rightIcon` | `ReactNode` | — | Icon on the right side |
| `containerStyle` | `ViewStyle` | — | Outer wrapper styles |
| `inputStyle` | `TextStyle` | — | Inner TextInput styles |
| `labelStyle` | `TextStyle` | — | Label text styles |
| `errorStyle` | `TextStyle` | — | Error text styles |
| `className` | `string` | — | NativeWind classes |
| *...TextInputProps* | | | All React Native `TextInput` props are supported |

---

### Badge

```tsx
import { Badge } from '@kyaw-min-khant/rnc';

<Badge label="New" color="primary" />
<Badge label="Error" color="error" variant="outline" />
<Badge count={5} color="error" />
<Badge count={120} maxCount={99} color="primary" />
<Badge label="Large" color="success" size="large" />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Text to display |
| `count` | `number` | — | Numeric count (use instead of `label`) |
| `maxCount` | `number` | `99` | Truncates count above this value (e.g. `"99+"`) |
| `variant` | `'filled' \| 'outline'` | `'filled'` | Visual style |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'success' \| 'warning'` | `'primary'` | Color palette |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Badge size |
| `style` | `ViewStyle` | — | Extra container styles |
| `textStyle` | `TextStyle` | — | Extra text styles |

---

### Dropdown

```tsx
import { Dropdown } from '@kyaw-min-khant/rnc';

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Disabled', value: 'c', disabled: true },
];

<Dropdown
  label="Choose one"
  placeholder="Select..."
  options={options}
  value={selected}
  onSelect={setSelected}
  isSearchable
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `DropdownOption[]` | — | List of `{ label, value, disabled? }` |
| `value` | `T \| null` | — | Currently selected value (controlled) |
| `onSelect` | `(value: T) => void` | — | Called when an option is selected |
| `placeholder` | `string` | `'Select...'` | Placeholder text |
| `label` | `string` | — | Label above the trigger |
| `isSearchable` | `boolean` | `true` | Shows a search input in the menu |
| `disabled` | `boolean` | `false` | Disables the trigger |
| `dropDownPosition` | `'top' \| 'bottom'` | `'bottom'` | Menu open direction |
| `dropDownLeftIcon` | `ReactNode` | — | Icon on the left of the trigger |
| `dropDownRightIcon` | `ReactNode` | — | Icon on the right of the trigger |
| `renderItem` | `(item, meta) => ReactNode` | — | Custom option renderer |

---

### FloatingActionButton

```tsx
import { FloatingActionButton } from '@kyaw-min-khant/rnc';

// Simple FAB
<FloatingActionButton
  icon={<PlusIcon />}
  onPress={() => {}}
/>

// Speed dial
<FloatingActionButton
  icon={<PlusIcon />}
  onPress={() => {}}
  actions={[
    { icon: <EditIcon />, label: 'Edit', onPress: () => {} },
    { icon: <ShareIcon />, label: 'Share', onPress: () => {} },
  ]}
/>

// Extended FAB with label
<FloatingActionButton
  icon={<PlusIcon />}
  label="Create"
  onPress={() => {}}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `onPress` | `() => void` | — | Press handler (or toggle for speed dial) |
| `icon` | `ReactNode` | — | Icon inside the FAB |
| `label` | `string` | — | Shows an extended FAB with text |
| `actions` | `FABAction[]` | `[]` | Speed-dial actions above the FAB |
| `position` | `'bottom-right' \| 'bottom-left' \| 'bottom-center'` | `'bottom-right'` | Screen position |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | FAB size |
| `color` | `string` | `theme.colors.primary` | Background color |
| `iconColor` | `string` | `theme.colors.onPrimary` | Icon/label color |
| `disabled` | `boolean` | `false` | Disables the FAB |
| `style` | `ViewStyle` | — | Extra styles |

---

## Utilities

### `cn()`

Merge class names conditionally for NativeWind:

```tsx
import { cn } from '@kyaw-min-khant/rnc';

<View className={cn('p-4 rounded', isActive && 'bg-blue-500', className)} />
```

---

## License

UNLICENSED — private package by [KMK-MOBILE](https://github.com/KMK-MOBILE).
