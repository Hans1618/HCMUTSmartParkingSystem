# Design System Specification: The Academic Pulse

## 1. Overview & Creative North Star: "The Digital Curator"
This design system moves away from the sterile, "utility-only" feel of traditional parking apps. Our North Star is **The Digital Curator**: a philosophy that treats information not as data to be dumped, but as an editorial experience to be guided. 

By blending HCMUT’s prestigious academic heritage with a "Tech-Forward" precision, we break the standard mobile grid. We utilize **intentional asymmetry**, where large editorial headlines (Manrope) anchor the eye, and **tonal layering** replaces rigid borders. The result is an interface that feels like a premium university publication—authoritative, breathable, and intelligently integrated.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
We use the official HCMUT palette not as mere accents, but as functional anchors within a sophisticated layered environment.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be achieved through background shifts.
*   **Surface Hierarchy:** A card component (`surface_container_lowest`) should sit atop a section background (`surface_container_low`), which in turn sits on the global `background` (#f9f9fd). This creates "implied boundaries" that feel more architectural and less "templated."

### Surface Hierarchy & Nesting
Use the Material 3 surface tiers to create physical depth:
*   **Base:** `surface` (#f9f9fd)
*   **Lower Utility:** `surface_container_low` (#f3f3f7) for secondary content areas.
*   **Active Content:** `surface_container_highest` (#e2e2e6) for interactive regions.
*   **The Focus Card:** `surface_container_lowest` (#ffffff) for the primary data points (e.g., current parking spot).

### The "Glass & Gradient" Rule
To elevate the tech-forward feel, use **Glassmorphism** for floating map overlays. Use `surface` colors at 70% opacity with a `20px` backdrop-blur. 
*   **Signature Texture:** For primary CTAs and Hero Parking Headers, use a subtle linear gradient: `primary` (#004d8a) to `primary_container` (#0065b3) at a 135° angle.

---

### Status Indicators (Real-Time)
*   **Available:** Use `tertiary` (#005078) with a soft `tertiary_fixed` glow. Avoid generic "Green." The deep teal feels more academic and integrated.
*   **Nearly Full:** Use `secondary` (#7f5700) / Gold. This represents the HCMUT heritage while signaling caution.
*   **Full:** Use `error` (#ba1a1a). High contrast against `surface` to ensure immediate user pivot.

---

## 3. Typography: Editorial Authority
The type system pairs the geometric precision of **Manrope** for high-level branding with the utilitarian clarity of **Inter** for data.

*   **Display & Headlines (Manrope):** Use `display-md` and `headline-lg` to create "Editorial Moments." Large, bold titles should have generous top-padding to let the interface breathe.
*   **Titles & Body (Inter):** Use `title-md` for parking lot names and `body-lg` for instructions. 
*   **The Data Label:** Use `label-md` in `on_surface_variant` (#414751) for timestamps and license plate numbers. It should feel like a footnote in a scholarly journal—small but perfectly legible.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are replaced by **Ambient Luminous Depth**.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface_container_lowest` card on a `surface_container_low` background creates a "Soft Lift."
*   **Ambient Shadows:** For floating action buttons or map markers, use a shadow with `Blur: 24px`, `Y: 8px`, and `Color: on_surface` (#191c1e) at **only 6% opacity**. It should feel like a natural light source, not a digital drop shadow.
*   **The "Ghost Border" Fallback:** If a divider is mandatory for accessibility (e.g., in a dense list), use `outline_variant` at **15% opacity**. Never 100%.

---

## 5. Components

### High-End Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `xl` roundedness (0.75rem), and `title-sm` (Inter) centered.
*   **Secondary:** No fill, no border. Use `primary` text with a `surface_container_high` background shift on hover/press.

### Financial Transaction Lists
*   **Style:** Forbid the use of divider lines. 
*   **Layout:** Each transaction is a block. The amount uses `title-lg` (Manrope) for weight. The date/time uses `label-sm` (Inter).
*   **Separation:** Use a `2.5` (0.625rem) spacing gap between items. Contrast is achieved by alternating the background between `surface` and `surface_container_lowest`.

### Map Elements & Markers
*   **The "Vignette" Overlay:** Map controls (Zoom, Recenter) should be housed in a Glassmorphic container (`surface` @ 80% opacity, backdrop-blur 12px) with `full` roundedness.
*   **Markers:** Use the `secondary_container` (Gold) for the user's current car location to provide a high-contrast "North Star" against the `primary` (Blue) map UI.

### Status Chips
*   **Interaction:** Chips should use `sm` roundedness (0.125rem) to maintain a "Technical/Grid" feel, contrasting against the `xl` roundedness of buttons. Use `tertiary_fixed` for "Available" backgrounds to keep text legible.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use whitespace as a separator. If you feel the need for a line, add `1rem` of padding instead.
*   **DO** overlap elements. Let a parking card slightly overlap the map view to create a sense of unified space.
*   **DO** use `surface_tint` at 5% opacity for large background areas to give the "White" a sophisticated, branded cool-grey tone.

### Don’t
*   **DON'T** use pure black (#000000) for text. Always use `on_surface` (#191c1e) to maintain a premium, ink-on-paper feel.
*   **DON'T** use standard 1px borders. They clutter the academic "cleanliness" of the system.
*   **DON'T** crowd the mobile viewport. If a screen feels full, move secondary data to a "Surface Container" bottom sheet.

### Accessibility Note
While we use subtle tonal shifts, ensure that text-to-background contrast ratios always meet WCAG AA standards. Use `on_primary_container` and `on_secondary_container` for text within colored regions to ensure maximum readability for students and faculty alike.