// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "empty-card",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "column",
    "width": 358,
    "gap": {
      "token": "spacing.sm"
    },
    "padding": {
      "all": {
        "token": "spacing.md"
      }
    },
    "borderRadius": "12px",
    "boxSizing": "border-box"
  },
  "style": {
    "background": {
      "token": "color.surface-primary-lighter"
    },
    "border": {
      "width": "1px",
      "style": "solid",
      "color": {
        "token": "color.border-tertiary"
      }
    }
  },
  "data": {
    "figmaName": "Empty card",
    "figmaId": "5405:106588"
  }
};

export function blankCardTemplate(props?: Record<string, unknown>): ComponentSpec {
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
