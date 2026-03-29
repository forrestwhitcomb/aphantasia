// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
// Variants: active (157:3340), inactive (157:3354)
// Missing VariableIDs for Step 7 audit: 157:3279→text-white-constant (active label)
import type { ComponentSpec } from "../../spec/types";

const VARIANTS: Record<string, ComponentSpec> = {
  "active": {
  "key": "type-active-size-big",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "row",
    "width": "100%",
    "height": 52,
    "align": "center",
    "justify": "center",
    "gap": {
      "token": "spacing.xxs"
    },
    "padding": {
      "right": {
        "token": "spacing.xl"
      },
      "left": {
        "token": "spacing.xl"
      }
    },
    "borderRadius": "24px",
    "boxSizing": "border-box"
  },
  "style": {
    "background": {
      "token": "color.surface-button-secondary-black"
    }
  },
  "data": {
    "figmaName": "Type=Active, Size=Big",
    "figmaId": "157:3340"
  },
  "children": [
    {
      "key": "label",
      "tag": "span",
      "layout": {
        "display": "inline-flex"
      },
      "style": {},
      "text": {
        "content": "Label",
        "style": "paragraph-md",
        "weight": 400,
        "editable": true,
        "color": {
          "token": "color.text-white-constant"
        }
      },
      "data": {
        "figmaName": "Label",
        "figmaId": "157:3331"
      }
    }
  ]
},
  "inactive": {
  "key": "type-inactive-size-big",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "row",
    "width": "100%",
    "height": 52,
    "align": "center",
    "justify": "center",
    "gap": {
      "token": "spacing.xxs"
    },
    "padding": {
      "right": {
        "token": "spacing.xl"
      },
      "left": {
        "token": "spacing.xl"
      }
    },
    "borderRadius": "24px",
    "boxSizing": "border-box"
  },
  "style": {
    "background": {
      "token": "color.surface-primary-light"
    }
  },
  "data": {
    "figmaName": "Type=inactive, Size=Big",
    "figmaId": "157:3354"
  },
  "children": [
    {
      "key": "label",
      "tag": "span",
      "layout": {
        "display": "inline-flex"
      },
      "style": {},
      "text": {
        "content": "Label",
        "style": "paragraph-md",
        "weight": 400,
        "editable": true,
        "color": {
          "token": "color.text-primary"
        }
      },
      "data": {
        "figmaName": "Label",
        "figmaId": "157:3356"
      }
    }
  ]
}
};

export function tabsTemplate(props?: Record<string, unknown>): ComponentSpec {
  const variant = (props?.variant as string) ?? Object.keys(VARIANTS)[0];
  const spec = JSON.parse(JSON.stringify(VARIANTS[variant] ?? VARIANTS[Object.keys(VARIANTS)[0]])) as ComponentSpec;
  if (props) applyTextOverrides(spec, props);
  return spec;
}

function applyTextOverrides(spec: ComponentSpec, props: Record<string, unknown>) {
  if (spec.text?.editable && spec.data?.figmaName && props[spec.data.figmaName] !== undefined) {
    spec.text.content = String(props[spec.data.figmaName]);
  }
  spec.children?.forEach(c => applyTextOverrides(c, props));
}
