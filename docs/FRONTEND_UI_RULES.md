# Frontend UI Rules

This file defines the default UI and frontend design rules for this project.

These rules are intentionally reusable across many kinds of products, including:

- websites
- web applications
- SaaS products
- dashboards
- admin panels
- landing pages
- portals
- e-commerce interfaces
- internal tools
- mobile-like web experiences
- portfolio and content-driven applications

The goal is not to force every project to look the same.

The goal is to make every interface feel intentional, consistent, readable, professional, accessible, and clearly designed rather than generated from a generic template.

---

## 1. Core Design Philosophy

Build interfaces with a clear visual hierarchy and a strong reason behind every design decision.

Do not design by stacking common UI patterns without thinking about their purpose.

Every page should answer:

1. What is the most important thing on this page?
2. What should the user notice first?
3. What is secondary?
4. What actions are available?
5. What information can be visually quieter?
6. Which elements actually need containers, borders, backgrounds, icons, or emphasis?

Prefer clarity over decoration.

Prefer structure over visual noise.

Prefer consistency over novelty.

Prefer purposeful asymmetry over forced equal layouts when content importance is different.

Do not make the interface look like a default AI-generated dashboard, generic SaaS starter, or unmodified component-library template.

---

## 2. Never Redesign Without a Reason

When modifying an existing project:

- inspect the existing design first
- understand the current hierarchy
- preserve working patterns
- preserve established colors unless a redesign is explicitly requested
- preserve responsive behavior
- preserve routes and application structure
- preserve accessibility behavior
- preserve product identity

Do not redesign an entire page just because a component can be made differently.

When asked to improve UI, improve:

- spacing
- hierarchy
- proportions
- alignment
- typography
- consistency
- responsiveness
- interaction quality
- accessibility

before introducing a new visual direction.

---

## 3. Avoid Generic AI UI

Avoid common patterns that make a product feel automatically generated.

Do not automatically use:

- cards for every section
- rounded-xl everywhere
- excessive pill badges
- large gradient hero text
- glassmorphism
- neon glows
- decorative gradients
- floating boxes for every group
- shadows on every surface
- unnecessary icon containers
- huge headings without a hierarchy reason
- overly spacious layouts
- random accent colors
- equal visual weight for every section
- identical repeated cards when the information is not equally important

Do not make every piece of content compete for attention.

A professional interface usually has areas that are intentionally quieter.

---

## 4. Visual Hierarchy

Each page should have a clear hierarchy.

Typical order:

```text
Primary purpose / heading
↓
Important action or summary
↓
Primary content
↓
Secondary content
↓
Supporting metadata
```

Use hierarchy through:

- font size
- font weight
- spacing
- alignment
- color contrast
- content position
- container size

Do not rely only on font size.

The most important element does not always need to be the largest element.

---

## 5. Layout Proportions

Avoid forcing every layout into equal columns.

When one area is more important, allow it to be larger.

A useful guide is approximately:

```text
60% / 40%
```

when primary and secondary content are shown side by side.

This is a guide, not a mathematical rule.

Use equal columns only when the content has equal importance.

Avoid awkward proportions created only because a grid system makes them convenient.

---

## 6. Spacing System

Use a small, predictable spacing scale.

A useful reference:

```text
8px
12–16px
20–24px
32px
48–56px
```

A golden-ratio-inspired scale such as:

```text
8
13
21
34
55
```

may be used as design guidance when it produces natural spacing.

Do not blindly use exact mathematical values.

Prefer the closest standard Tailwind utility when practical.

Use spacing consistently for:

- page padding
- section gaps
- card padding
- form fields
- list rows
- table cells
- headings
- buttons
- navigation
- content groups

Avoid arbitrary values such as:

```text
11px
17px
29px
43px
```

unless the design genuinely requires them.

---

## 7. Typography

Use a restrained typography scale.

A practical default:

```text
Small/supporting text: 12–14px
Body text:              14–16px
Section heading:        18–22px
Page heading:           26–34px
Large metric/display:   32–44px
```

Adapt this to the project type.

Do not create too many text sizes.

Use:

- size
- weight
- line height
- spacing
- muted color

together to create hierarchy.

Avoid:

- oversized page headings
- every heading being bold
- excessive uppercase text
- overly tight line-height
- muted text with insufficient contrast
- multiple fonts without a strong reason

---

## 8. Color System

Use a controlled color system.

Each project should define:

- page background
- surface/background
- primary brand color
- primary hover/active
- soft primary background
- main text
- muted text
- border
- success
- warning
- danger

Use semantic colors consistently.

Example:

```text
Primary → main actions / brand / active state
Success → completed / positive state
Warning → pending / caution
Danger  → destructive action / error
```

Do not introduce random new colors for visual variety.

Accent color should support hierarchy, not dominate the entire page.

In dark mode, prefer neutral charcoal/dark-gray surfaces unless the brand specifically requires another direction.

Do not automatically make the full dark background a dark version of the brand color.

---

## 9. Light and Dark Mode

Light and dark modes should share the same hierarchy and structure.

Dark mode is not a separate redesign.

Only the visual tokens should change:

- background
- surface
- border
- text
- muted text
- semantic colors where needed

Prefer:

```tsx
bg-white dark:bg-zinc-900
text-zinc-900 dark:text-zinc-100
border-zinc-200 dark:border-zinc-700
```

or project-specific design tokens.

Keep contrast accessible.

Avoid dark themes with:

- muddy colored backgrounds
- low-contrast borders
- gray text that becomes unreadable
- excessive glowing accents

---

## 10. Tailwind-First Styling

When Tailwind is used, prefer Tailwind utilities directly in components.

Keep `globals.css` limited to true global concerns such as:

- Tailwind import/configuration
- design tokens
- body defaults
- global typography defaults
- focus styles
- reduced-motion rules
- theme configuration

Do not recreate a large traditional stylesheet full of component-specific selectors.

Prefer readable JSX with organized Tailwind classes over hidden style dependencies.

Avoid excessive one-off arbitrary values when a standard utility works.

---

## 11. Components Should Be Purposeful

Create reusable components when there is real repetition or shared behavior.

Good candidates:

- Button
- Input
- Dialog
- StatusBadge
- PageHeader
- EmptyState
- Avatar
- Select
- FormField
- Pagination

Do not create abstractions only to reduce a few lines of code.

Avoid overly generic components that require many props just to reproduce normal HTML.

A component should improve at least one of:

- consistency
- reuse
- accessibility
- behavior
- maintainability
- readability

---

## 12. shadcn/ui Usage

shadcn/ui is allowed and encouraged for specific components where it provides useful behavior and structure.

Use shadcn selectively.

Good uses include:

- Dialog
- AlertDialog
- DropdownMenu
- Select
- Popover
- Tooltip
- Tabs
- Sheet
- Checkbox
- RadioGroup
- Switch
- Command / Combobox
- Toast / Sonner
- accessible form primitives
- complex interactive controls

The purpose of using shadcn is:

- accessibility
- keyboard support
- focus management
- predictable interaction behavior
- faster implementation of complex controls

Do NOT use shadcn as the visual identity of the project.

Do NOT automatically use:

- shadcn Card for every section
- default shadcn spacing everywhere
- default shadcn radius everywhere
- default shadcn page layouts
- default shadcn dashboard styling

Every shadcn component must be adapted to the project’s:

- color system
- spacing
- typography
- density
- radius
- borders
- interaction states

The final interface should not look like a default shadcn template.

Use shadcn for behavior and structure, then style it according to the project.

---

## 13. Radix UI Usage

Radix UI may be used when low-level accessible interactive primitives are needed.

Radix is especially useful for:

- Dialog
- Alert Dialog
- Dropdown Menu
- Popover
- Tooltip
- Select
- Tabs
- Accordion
- Checkbox
- Switch
- Radio Group
- Context Menu

Use Radix when it meaningfully improves:

- accessibility
- keyboard navigation
- focus handling
- interaction behavior
- ARIA behavior

Do not use Radix merely because it exists.

In most projects:

```text
Normal layout / page structure
→ React / Next.js + Tailwind

Reusable application components
→ custom components

Complex interactive controls
→ shadcn/ui

Lower-level interaction when necessary
→ Radix UI
```

Remember:

> Radix provides behavior and accessibility.
> shadcn provides editable component implementations.
> Tailwind provides visual styling.
> The project itself provides the visual identity.

---

## 14. Buttons

Buttons must have clear hierarchy.

Typical hierarchy:

```text
Primary   → main action
Secondary → alternative action
Ghost     → low-emphasis action
Danger    → destructive action
```

Do not make every button primary.

Avoid:

- unnecessary gradients
- excessive shadow
- overly rounded pill buttons by default
- icon-only buttons without labels or accessible names
- large buttons for minor actions

Use hover, focus, disabled, and loading states consistently.

---

## 15. Cards and Containers

Use cards when they improve grouping.

A card should usually represent:

- a meaningful data unit
- a grouped control
- a distinct piece of content
- a summary
- a self-contained interactive area

Do not put every section inside a card.

Sometimes this is better:

```text
Section Heading
────────────────
Row
Row
Row
```

than:

```text
[ giant bordered card containing everything ]
```

Use borders, surface changes, and spacing only when they improve separation.

---

## 16. Forms

Forms should be easy to scan.

Use consistent:

- label placement
- field height
- field spacing
- error placement
- helper text
- focus styles
- action placement

Keep forms reasonably narrow on large screens unless the content benefits from additional width.

Do not place unrelated fields side by side just to fill space.

Use two-column forms only when the fields logically pair well.

Required/optional states should be clear.

Error messages should appear close to the relevant field.

---

## 17. Tables and Data-Dense Interfaces

Tables should prioritize readability.

Use:

- clear column alignment
- compact but comfortable row height
- subtle separators
- restrained header styling
- hover state when rows are interactive
- horizontal scrolling on small screens when necessary

Avoid:

- borders around every cell
- excessive radius
- card-within-card table rows
- unnecessary icons in every column
- excessive badges

Use semantic status styling only where meaningful.

---

## 18. Navigation

Navigation should clearly show:

- current location
- available destinations
- hierarchy when relevant

Active states should be visually clear but not overpowering.

Do not rely only on color when possible.

Keep navigation labels concise.

Avoid adding icons to every item unless they genuinely improve recognition.

On mobile, navigation must remain easy to reach and dismiss.

---

## 19. Icons

Use one icon library consistently per project when practical.

Lucide is a strong default.

Use icons to improve recognition, not decoration.

Good icon use:

- navigation
- common actions
- status
- search
- settings
- delete
- edit
- add
- calendar

Avoid:

- icon containers around every icon
- multiple icon styles in the same interface
- icons beside text that already communicates the same thing clearly
- decorative icons that add visual noise

Icon-only actions must have accessible labels.

---

## 20. Border Radius

Use a restrained radius system.

Example:

```text
Small controls: 6–8px
Inputs/buttons: 6–10px
Cards/surfaces: 8–12px
Pills: only for badges/chips when appropriate
```

Do not make everything fully rounded.

Radius should support the project’s identity, not become the identity itself.

---

## 21. Shadows

Use shadows sparingly.

Prefer:

- borders
- contrast between surfaces
- spacing

before adding shadows.

Use stronger shadows mainly for elements that visually float:

- dialogs
- menus
- popovers
- dropdowns

Avoid shadow-sm on every card merely because it is common.

---

## 22. Motion and Animation

Motion should communicate state or improve orientation.

Good uses:

- menu opening
- dialog transitions
- accordion expansion
- loading state
- small hover feedback

Avoid:

- decorative movement
- long animations
- excessive scaling
- bouncing elements
- animations on every card

Respect `prefers-reduced-motion`.

---

## 23. Responsive Design

Responsive behavior must be designed, not added as an afterthought.

Review at minimum:

```text
mobile
tablet
desktop
```

Ask what should:

- stack
- wrap
- scroll
- collapse
- hide
- remain fixed
- become full width

Do not simply shrink desktop UI until it fits.

Common rules:

- multi-column layouts stack naturally
- forms use full width on small screens
- tables scroll horizontally when necessary
- buttons remain easy to tap
- navigation becomes appropriate for mobile
- important actions remain discoverable

---

## 24. Accessibility

Accessibility is part of UI quality.

Preserve or add:

- semantic HTML
- labels for form controls
- visible keyboard focus
- sufficient contrast
- keyboard navigation
- `aria-current`
- `aria-expanded`
- meaningful `aria-label`
- correct heading order
- reduced-motion support
- accessible dialogs and menus

Do not remove accessibility behavior for visual simplicity.

This is one major reason to use shadcn/Radix for complex interactive components.

---

## 25. Empty, Loading, Error, and Success States

Every important interface should consider:

- loading
- empty
- error
- success

Do not leave blank areas without explanation.

Empty states should be concise and helpful.

Avoid giant illustrations unless the product style supports them.

Error states should explain what failed and what the user can do next.

---

## 26. Content Density

Choose density based on the product.

A marketing page may use more whitespace.

A productivity tool may need tighter spacing.

A data-heavy screen should prioritize scan speed.

Do not apply the same density to every project.

The rule is:

> Use enough space to make structure clear, but not so much that related information feels disconnected.

---

## 27. Product Identity

The visual identity should come from a small number of deliberate decisions:

- color palette
- typography
- density
- spacing
- radius
- icon treatment
- interaction patterns

Do not try to create identity through excessive decoration.

When entering an existing project, follow its established identity unless explicitly asked to change it.

---

## 28. Before Building a New Page

Before writing code:

1. Identify the page’s primary purpose.
2. Identify the primary action.
3. Identify the most important content.
4. Separate primary and secondary information.
5. Decide whether sections need cards or can remain open.
6. Reuse existing project patterns.
7. Check the existing color/spacing/typography system.
8. Decide responsive behavior.
9. Decide whether a complex control should use shadcn/Radix.
10. Only then implement the UI.

Do not immediately generate a generic page template.

---

## 29. Before Changing Existing UI

Inspect first.

Look for:

- inconsistent spacing
- weak hierarchy
- excessive borders
- unnecessary cards
- inconsistent typography
- random colors
- inconsistent radius
- unnecessary icons
- poor alignment
- awkward proportions
- responsive problems
- accessibility issues

Fix the system, not only the visible symptom.

---

## 30. Preferred Technology Strategy

When applicable:

```text
Framework
→ Next.js / React

Styling
→ Tailwind CSS

Icons
→ Lucide or another single consistent icon set

Interactive accessible primitives
→ shadcn/ui selectively

Low-level accessible primitives
→ Radix UI when needed
```

Do not add a library when ordinary HTML, React, or Tailwind is enough.

Every dependency should solve a real problem.

---

## 31. Codex / AI Implementation Rules

When an AI coding agent works on this project:

- inspect existing components before creating new ones
- reuse project patterns
- preserve the design system
- do not redesign without permission
- do not generate generic SaaS styling
- do not automatically use shadcn Card everywhere
- do not introduce gradients unless the project already uses them
- do not add new colors without a reason
- do not add dependencies without a reason
- use Tailwind-first styling when Tailwind is present
- prefer semantic HTML
- preserve accessibility
- preserve responsiveness
- keep client/server component boundaries appropriate
- keep JSX readable
- avoid unnecessary abstractions
- run lint/build after meaningful UI work

When using shadcn:

> Use it for robust interaction and accessibility, not as a visual template.

When using Radix:

> Use it for low-level accessible behavior when that behavior is genuinely needed.

---

## 32. Final UI Review Checklist

Before considering a UI task finished, verify:

### Hierarchy
- Is the most important content obvious?
- Are secondary elements visually quieter?

### Spacing
- Is spacing consistent?
- Are related elements visually grouped?

### Typography
- Is the scale restrained and consistent?
- Is body text readable?

### Color
- Are semantic colors used correctly?
- Are there unnecessary accent colors?

### Components
- Are cards used only where useful?
- Are controls consistent?

### Interaction
- Are hover/focus/disabled states present?
- Are complex controls keyboard accessible?

### Responsive
- Does the page work on mobile, tablet, and desktop?

### Dark Mode
- Is hierarchy preserved?
- Is contrast sufficient?

### Accessibility
- Can the interface be used with a keyboard?
- Are controls labeled correctly?

### Identity
- Does this look like this project?
- Or does it look like a generic component-library/demo template?

If the answer to the last question is “generic template,” refine the design before considering the task complete.

---

# Short Rule to Remember

> Build with purpose, not patterns.
>
> Use Tailwind for the visual system.
>
> Use shadcn selectively for robust interactive components.
>
> Use Radix when low-level accessible behavior is needed.
>
> Keep the project’s own identity.
>
> Never let a component library or AI-generated template become the design system by accident.
