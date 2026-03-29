// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "state-inactive",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "column",
    "width": "100%",
    "justify": "center",
    "padding": {
      "top": {
        "token": "spacing.xxs"
      },
      "bottom": {
        "token": "spacing.xxs"
      }
    },
    "boxSizing": "border-box"
  },
  "style": {},
  "data": {
    "figmaName": "State=inactive",
    "figmaId": "1283:64242"
  },
  "children": [
    {
      "key": "label",
      "tag": "span",
      "layout": {
        "display": "inline-flex",
        "width": "100%"
      },
      "style": {},
      "text": {
        "content": "Label",
        "style": "paragraph-xs",
        "weight": 400,
        "editable": true,
        "color": {
          "token": "color.text-secondary"
        }
      },
      "data": {
        "figmaName": "label",
        "figmaId": "1283:64246"
      }
    },
    {
      "key": "input-field",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "width": "100%",
        "align": "center",
        "gap": {
          "token": "spacing.xs"
        },
        "padding": {
          "bottom": {
            "token": "spacing.xs"
          }
        },
        "boxSizing": "border-box"
      },
      "style": {
        "border": {
          "width": "1px",
          "style": "solid",
          "color": {
            "token": "color.border-tertiary"
          }
        }
      },
      "data": {
        "figmaName": "Input field",
        "figmaId": "1284:955"
      },
      "children": [
        {
          "key": "input",
          "tag": "span",
          "layout": {
            "display": "inline-flex",
            "width": "100%"
          },
          "style": {},
          "text": {
            "content": "Placeholder",
            "style": "paragraph-md",
            "weight": 400,
            "editable": true,
            "color": {
              "token": "color.text-tertiary"
            }
          },
          "data": {
            "figmaName": "input",
            "figmaId": "1283:64245"
          }
        }
      ]
    }
  ]
};

export function textFieldTemplate(props?: Record<string, unknown>): ComponentSpec {
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
