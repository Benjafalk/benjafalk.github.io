---
name: "Benjamin Falk Portfolio"
description: "A precise, tactile engineering portfolio built like a set of working field notes."
colors:
  paper: "#f3efe5"
  paper-deep: "#e4ded0"
  ink: "#141310"
  muted-graphite: "#5a574f"
  safety-orange: "#c73a0e"
  safety-orange-surface: "#df4c10"
  safety-orange-dark: "#9f2806"
  field-white: "#fffdf7"
  rule-ink: "rgba(20, 19, 16, 0.24)"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(3.7rem, 7vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(2.8rem, 5.5vw, 5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(1.25rem, 2.4vw, 1.9rem)"
    fontWeight: 700
    lineHeight: 1.16
    letterSpacing: "-0.035em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Roboto Mono, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.07em"
rounded:
  square: "0"
  round: "50%"
components:
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.field-white}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "0 22px"
    height: "50px"
  button-dark-hover:
    backgroundColor: "{colors.safety-orange-surface}"
    textColor: "{colors.ink}"
  button-signal:
    backgroundColor: "{colors.safety-orange-surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "0 22px"
    height: "50px"
  button-signal-hover:
    backgroundColor: "{colors.field-white}"
    textColor: "{colors.ink}"
  social-link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    size: "46px"
  buddy-button:
    backgroundColor: "{colors.safety-orange-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.round}"
    size: "58px"
---

# Design System: Benjamin Falk Portfolio

## Overview

**Creative North Star: "The Engineering Field Notes"**

The portfolio feels like an engineer's working notebook refined for public view: precise, pragmatic, tactile, modern, and professionally technical. Warm paper, dense ink, ruled separators, clipped data labels, and a focused safety-orange signal family make the work feel observed and recorded rather than decorated.

The system is crisp and confident. Large typography carries the hierarchy; mono labels and ledger structures supply technical specificity; subtle paper grain keeps flat surfaces physical. A contrast-aware orange pair separates accent text from filled or ink-backed signals. Personality is concentrated in a few purposeful artifacts—the tilted field sheet, reactive logo, social links, and assistant—so the portfolio remains credible and easy to scan.

**Key Characteristics:**

- Warm paper canvas with visible but restrained texture.
- Oversized Manrope headlines paired with calm DM Sans body copy and Roboto Mono data labels.
- Contrast-aware safety oranges used as signals, not general surface color.
- Separator-led layouts, square controls, and sparse, intentional lift.
- Responsive structures that collapse cleanly while preserving the ledger-like rhythm.

## Colors

The palette reads as paper, ink, and safety marking: warm neutrals carry the surface, near-black establishes structure, and orange calls attention to live or important information.

### Primary

- **Safety Orange:** Emphasized headline words on the warm paper canvas.
- **Surface Safety Orange:** Filled actions, status dots, signal traces, active underlines, focus outlines, text on ink, and interactive hover responses.
- **Deep Safety Orange:** Small project identifiers where the standard orange would be too loud against the paper.

### Neutral

- **Field Paper:** The default page canvas and quiet component ground.
- **Deep Paper:** Scrollbar tracks and locked or subdued row states.
- **Engineering Ink:** Headlines, rules, dark bands, primary buttons, and high-confidence marks.
- **Muted Graphite:** Supporting copy, inactive navigation, metadata, and secondary information.
- **Field White:** The taped field sheet, high-contrast text, and lifted hover surfaces.
- **Rule Ink:** Low-emphasis separators where full ink would overpower the content.

**The Signal, Not Paint Rule.** Safety Orange is for text on paper; Surface Safety Orange is for fills, rules, focus, and text on ink. Neither becomes a broad decorative background.

## Typography

**Display Font:** Manrope (with sans-serif fallback)
**Body Font:** DM Sans (with sans-serif fallback)
**Label/Mono Font:** Roboto Mono (with monospace fallback)

**Character:** Manrope provides blunt, modern authority; DM Sans keeps explanations open and readable; Roboto Mono turns status, dates, and domains into instrument labels. Tight display spacing contrasts with generous body leading.

### Hierarchy

- **Display** (700, fluid 3.7–6rem, 0.98): Hero and page-intro statements; selected words may switch to Safety Orange.
- **Headline** (700, fluid 2.8–5rem, 0.98): Section openings and major collection labels.
- **Title** (700, fluid 1.25–1.9rem, 1.16): Project, role, and row titles.
- **Body** (400, 1rem, 1.6): Explanatory copy, usually constrained to roughly 58–68 characters.
- **Label** (400, 0.72rem, 0.07em, uppercase where semantic): Status, dates, project numbers, domains, and compact metadata.

**The Instrument Label Rule.** Reserve monospace for operational metadata; never use it for long prose or large promotional headlines.

## Layout

The shared shell is capped at 1240px with 32px desktop side gutters. Desktop compositions use asymmetric grids: the home hero balances copy against a field sheet, while section headers pair a dominant title with a narrow explanation. Long content is organized as ruled lists rather than freestanding cards, with generous 100–155px section intervals.

At 1000px, two-column compositions stack, the shell narrows to 40px total gutters, and ledger rows compress from four columns to three. At 700px, the shell uses 16px side gutters; navigation tightens, the logo wordmark disappears, and ledger, contact, profile, and footer structures collapse to one- or two-column arrangements. Fluid headline clamps preserve the same assertive hierarchy at every width.

## Elevation & Depth

The system is flat by default. Rules, contrast, and paper tones separate regions; shadows are reserved for the tilted field sheet, the reactive logo, social hover states, and the floating assistant. Their directional down-right shadows make these elements feel physically placed on the paper without turning every surface into a card.

### Shadow Vocabulary

- **Field Sheet Lift** (`18px 22px 45px rgba(20, 19, 16, .13)`): The home-page engineering sheet only.
- **Logo Response** (`7px 9px 20px rgba(20, 19, 16, .2)`): Logo hover and keyboard focus.
- **Social Response** (`5px 7px 18px rgba(20, 19, 16, .18)`): Social hover and keyboard focus.
- **Buddy Lift** (`6px 8px 20px rgba(20, 19, 16, .18)`): The persistent assistant button; its open bubble uses the stronger companion shadow recorded in the sidecar.

**The Reserved Lift Rule.** If an element is not a physical artifact or a playful interactive response, keep it flat and separate it with a rule or tonal shift.

## Shapes

The core form language is square, ruled, and clipped: buttons, logo, field sheet, ledgers, contact rows, and social controls use hard corners and one-pixel borders. Circles are exceptional and meaningful—the status dot, signal nodes, and assistant button. The field sheet's slight rotation and translucent tape are the lone deliberately imperfect silhouette.

## Components

Components feel like dependable instruments: clear state changes, square geometry, sturdy weight, and no ornamental chrome.

### Buttons

- **Shape:** Square with a one-pixel border and a 50px minimum height.
- **Dark:** Ink surface with Field White text; hover switches to Surface Safety Orange and lifts 2px.
- **Signal:** Surface Safety Orange with ink text; hover switches to Field White and reveals an ink border.
- **Focus:** A three-pixel Surface Safety Orange outline offset four pixels from the control.

### Navigation

The header uses compact semibold DM Sans links. Inactive links are Muted Graphite; hover and active links become Engineering Ink and draw a two-pixel Surface Safety Orange underline from left to right. Every link retains a 44px minimum target height.

### Cards / Containers

Avoid generic cards. Collections, facts, disciplines, and contact methods are open rows bounded by rules. Hoverable ledger rows shift to Field White and gain horizontal inset instead of receiving a shadow. The one signature container is the tilted Field Sheet: Field White paper, an ink border, orange tape, ruled data rows, and the reserved Field Sheet Lift. Its signal trace draws once on load, then four constrained nodes unlock for mouse, touch, and arrow-key manipulation; both traces follow the edited signal.

### Status Labels

Status lines pair uppercase Roboto Mono text with a Surface Safety Orange dot and a soft halo. They identify location, freshness, or collection context; they are not interactive chips.

### Social Links

Social controls are 46px square outlined marks. Hover and focus apply the service color, white icon, slight counter-clockwise rotation, 3px lift, and the reserved Social Response shadow.

### Portfolio Assistant

The assistant is the only circular control. Its Surface Safety Orange 58px button floats at the lower-right edge, opens a square ink speech bubble, and uses short expressive motion; Escape dismisses the message and reduced-motion preferences remove nonessential animation.

## Do's and Don'ts

### Do:

- **Do** build hierarchy with oversized Manrope, ruled rows, and clear spacing before adding containers.
- **Do** keep body copy in Muted Graphite and constrain readable passages to roughly 58–68 characters.
- **Do** use Safety Orange for emphasis text on paper and Surface Safety Orange for active states, fills, focus, and text on ink.
- **Do** preserve 44px minimum targets, visible focus outlines, and reduced-motion behavior.

### Don't:

- **Don't** introduce rounded cards, pill controls, gradient washes, or soft dashboard chrome.
- **Don't** add shadows to ordinary sections, ledgers, or text containers.
- **Don't** turn Roboto Mono into a body or display face.
- **Don't** invent form fields or input styling until an implemented form establishes those primitives.
