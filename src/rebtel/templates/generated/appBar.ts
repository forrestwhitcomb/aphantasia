// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "property-1-ios",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "row",
    "width": 390,
    "align": "center",
    "justify": "center",
    "padding": {
      "top": {
        "token": "spacing.sm"
      },
      "right": "40px",
      "bottom": {
        "token": "spacing.sm"
      },
      "left": {
        "token": "spacing.md"
      }
    },
    "boxSizing": "border-box"
  },
  "style": {},
  "data": {
    "figmaName": "Property 1=iOS",
    "figmaId": "222:6310"
  },
  "children": [
    {
      "key": "section-header",
      "tag": "span",
      "layout": {
        "display": "inline-flex",
        "width": "100%"
      },
      "style": {},
      "text": {
        "content": "Section header",
        "style": "paragraph-md",
        "weight": 400,
        "editable": true,
        "color": {
          "token": "color.text-primary"
        }
      },
      "data": {
        "figmaName": "Section header",
        "figmaId": "I222:6295;165:19439"
      }
    }
  ]
};

export function appBarTemplate(props?: Record<string, unknown>): ComponentSpec {
  const spec = JSON.parse(JSON.stringify(BASE_SPEC)) as ComponentSpec;
  if (props) applyTextOverrides(spec, props);
  return spec;
}

function applyTextOverrides(spec: ComponentSpec, props: Record<string, unknown>) {
  if (spec.text?.editable && spec.data?.figmaName && props[spec.data.figmaName] !== undefined) {
    spec.text.content = String(props[spec.data.figmaName]);
  }
  spec.children?.forEach(c => applyTextOverrides(c, props));
}
