# RNC — React Native Components

shadcn-style React Native components with full **StyleSheet** and **NativeWind (Tailwind)** support. There's nothing to `npm install` — a CLI copies each component's source directly into your project, so you own the code and only add what you actually use. Every component is theme-aware — customize colors and roundness once via `ThemeProvider` and all components update automatically.

---

## Table of Contents

- [RNC — React Native Components](#rnc--react-native-components)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Setup](#setup)
  - [CLI Reference](#cli-reference)
    - [`rnc init`](#rnc-init)
    - [`rnc add`](#rnc-add)
    - [`rnc list`](#rnc-list)
    - [`components.json`](#componentsjson)
  - [Theme](#theme)
    - [`RNCTheme` interface](#rnctheme-interface)
    - [`useTheme()`](#usetheme)
  - [Components](#components)
    - [Button](#button)
    - [Input](#input)
    - [Badge](#badge)
    - [Dropdown](#dropdown)
    - [FloatingActionButton](#floatingactionbutton)
    - [Skeleton](#skeleton)
    - [DateTimePicker](#datetimepicker)
  - [Utilities](#utilities)
    - [`cn()`](#cn)
  - [License](#license)

---

## Getting Started

```bash
npx @kyaw-min-khant/rnc init
npx @kyaw-min-khant/rnc add button
```

`init` asks where you want components, the theme, and utilities placed in your project, and writes those choices to a `components.json`. `add` then copies the requested component's source there — along with any shared files it needs (like `ThemeContext.tsx`) — rewriting its imports to match your chosen paths automatically.

The examples below assume the defaults offered by `init`:

| Alias | Default path |
|---|---|
| `components` | `src/components/ui` |
| `theme` | `src/theme` |
| `utils` | `src/lib` |

If you picked different paths, adjust the import paths in the examples accordingly.

---

## Setup

Wrap your root component with `ThemeProvider`, exported from the theme file `rnc add` copies in. You can pass a partial theme — anything you omit falls back to the default.

```tsx
import { ThemeProvider } from './src/theme/ThemeContext';

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

## CLI Reference

### `rnc init`

Creates `components.json` in the current directory. Prompts for three paths (components, theme, utils) and refuses to overwrite an existing config without confirmation.

### `rnc add`

```bash
npx @kyaw-min-khant/rnc add <component> [components...]
npx @kyaw-min-khant/rnc add dropdown skeleton --overwrite
```

Copies one or more components into your project. Resolves each component's dependencies automatically (e.g. adding `dropdown` also adds `theme` and `utils` if you don't already have them) and installs any npm packages a component needs via whichever package manager your project uses (detected from `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` / `bun.lockb`). Existing files are skipped unless you pass `-o, --overwrite`.

### `rnc list`

Prints every available component name and a one-line description.

### `components.json`

```json
{
  "$schema": "https://kyaw-min-khant.dev/rnc/schema/components.json",
  "aliases": {
    "components": "src/components/ui",
    "theme": "src/theme",
    "utils": "src/lib"
  }
}
```

You can point these at wherever fits your project structure — `rnc add` reads this file to decide both where to write files and how to rewrite each copied component's internal imports.

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
import { useTheme } from './src/theme/ThemeContext';

function MyComponent() {
  const theme = useTheme();
  return <View style={{ backgroundColor: theme.colors.surface }} />;
}
```

---

## Components

### Button

```bash
npx @kyaw-min-khant/rnc add button
```

```tsx
import { Button } from './src/components/ui/Button';

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

```bash
npx @kyaw-min-khant/rnc add input
```

```tsx
import { Input } from './src/components/ui/Input';

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

```bash
npx @kyaw-min-khant/rnc add badge
```

```tsx
import { Badge } from './src/components/ui/Badge';

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
| `className` | `string` | — | NativeWind classes |

---

### Dropdown

```bash
npx @kyaw-min-khant/rnc add dropdown
```

```tsx
import { Dropdown } from './src/components/ui/Dropdown';

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
| `onChange` | `(value: T) => void` | — | Same as `onSelect`, provided for API consistency |
| `placeholder` | `string` | `'Select...'` | Placeholder text |
| `placeholderTextColor` | `string` | — | Color of the placeholder and search input placeholder |
| `label` | `string` | — | Label above the trigger |
| `isSearchable` | `boolean` | `true` | Shows a search input in the menu |
| `disabled` | `boolean` | `false` | Disables the trigger |
| `dropDownPosition` | `'top' \| 'bottom'` | `'bottom'` | Menu open direction |
| `dropDownLeftIcon` | `ReactNode` | — | Icon on the left of the trigger |
| `dropDownRightIcon` | `ReactNode` | — | Icon on the right of the trigger |
| `renderItem` | `(item, meta) => ReactNode` | — | Custom option renderer |
| `style` | `ViewStyle` | — | Outer wrapper styles |
| `dropDownStyle` | `ViewStyle` | — | Trigger button styles |
| `menuStyle` | `ViewStyle` | — | Dropdown menu container styles |
| `optionStyle` | `ViewStyle` | — | Individual option row styles |
| `optionTextStyle` | `TextStyle` | — | Option label text styles |
| `selectedOptionStyle` | `ViewStyle` | — | Styles applied to the selected option row |
| `selectedOptionTextStyle` | `TextStyle` | — | Styles applied to the selected option's text |
| `labelStyle` | `TextStyle` | — | Label text styles |
| `className` | `string` | — | NativeWind classes for the wrapper |
| `dropDownClassName` | `string` | — | NativeWind classes for the trigger |

---

### FloatingActionButton

```bash
npx @kyaw-min-khant/rnc add floating-action-button
```

```tsx
import { FloatingActionButton } from './src/components/ui/FloatingActionButton';

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

### Skeleton

Loading placeholder with a pulsing opacity animation (built on React Native's core `Animated` API — no extra dependency required). Comes in two shapes.

```bash
npx @kyaw-min-khant/rnc add skeleton
```

```tsx
import { Skeleton } from './src/components/ui/Skeleton';

// Rectangular skeleton, e.g. a text line
<Skeleton width="60%" height={16} />

// Circle skeleton, e.g. an avatar placeholder
<Skeleton variant="circle" size={48} />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'rectangular' \| 'circle'` | `'rectangular'` | Shape of the skeleton |
| `width` | `number \| string` | `'100%'` | Width — number (px) or percentage string like `'60%'` (rectangular only) |
| `height` | `number \| string` | `16` | Height — number (px) or percentage string (rectangular only) |
| `size` | `number` | `40` | Diameter in px (circle only) |
| `borderRadius` | `number` | `theme.roundness` | Corner radius (rectangular only) |
| `color` | `string` | `#9c9c9d` | Fill color |

---

### DateTimePicker

A fully custom, inline date & time picker with no external calendar dependency. It renders directly in your layout — no modal or trigger field — and steps through **month → day → time**.

```bash
npx @kyaw-min-khant/rnc add date-time-picker
```

```tsx
import { DateTimePicker } from './src/components/ui/DateTimePicker';

const [date, setDate] = useState(new Date());

// Full date + time (default)
<DateTimePicker value={date} onChange={setDate} />

// Date only
<DateTimePicker value={date} onChange={setDate} mode="date" />

// Time only, 12-hour with AM/PM
<DateTimePicker value={date} onChange={setDate} mode="time" is24Hour={false} />

// Bounded range, 15-minute steps, week starts on Monday
<DateTimePicker
  value={date}
  onChange={setDate}
  minimumDate={new Date()}
  maximumDate={new Date(2027, 0, 1)}
  minuteInterval={15}
  firstDayOfWeek={1}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `Date \| null` | `new Date()` | Selected date/time |
| `onChange` | `(date: Date) => void` | — | Fires whenever the year, month, day, hour, minute or AM/PM changes |
| `mode` | `'date' \| 'time' \| 'datetime'` | `'datetime'` | Which parts of the date are selectable |
| `minimumDate` | `Date` | — | Earliest selectable day |
| `maximumDate` | `Date` | — | Latest selectable day |
| `is24Hour` | `boolean` | `true` | 24-hour hour wheel instead of 12-hour + AM/PM |
| `minuteInterval` | `1 \| 5 \| 10 \| 15 \| 30` | `1` | Step between selectable minutes |
| `firstDayOfWeek` | `0 \| 1` | `0` | Week starts on Sunday (`0`) or Monday (`1`) |
| `color` | `string` | `theme.colors.primary` | Accent color for the selected day/month and wheel highlight |
| `style` | `ViewStyle` | — | Extra container styles |
| `className` | `string` | — | NativeWind classes |

> Selecting a day in `"datetime"` mode automatically advances to the time step. Tapping the month/year header on the day grid jumps back to the month picker.

---

## Utilities

### `cn()`

Merge class names conditionally for NativeWind. Added automatically alongside any component that needs it (e.g. `Dropdown`), or on its own:

```bash
npx @kyaw-min-khant/rnc add utils
```

```tsx
import { cn } from './src/lib/cn';

<View className={cn('p-4 rounded', isActive && 'bg-blue-500', className)} />
```

---

## License

UNLICENSED — private package by [KMK-MOBILE](https://github.com/KMK-MOBILE).
