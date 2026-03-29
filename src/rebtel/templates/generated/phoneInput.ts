// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "state-passive",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "column",
    "width": 358,
    "height": 52,
    "align": "center",
    "gap": {
      "token": "spacing.sm"
    },
    "padding": {
      "right": {
        "token": "spacing.md"
      },
      "left": {
        "token": "spacing.md"
      }
    },
    "boxSizing": "border-box"
  },
  "style": {},
  "data": {
    "figmaName": "State=Passive",
    "figmaId": "163:16758"
  },
  "children": [
    {
      "key": "enter-number-container",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "width": 358,
        "height": 52,
        "align": "center",
        "borderRadius": "24px",
        "boxSizing": "border-box",
        "overflow": "hidden"
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
        "figmaName": "Enter number container",
        "figmaId": "163:7097"
      },
      "children": [
        {
          "key": "county-picker",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "row",
            "width": 72,
            "height": 52,
            "align": "center",
            "boxSizing": "border-box"
          },
          "style": {},
          "data": {
            "figmaName": "County picker",
            "figmaId": "163:7100"
          }
        },
        {
          "key": "frame-479",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "row",
            "width": "100%",
            "align": "center",
            "boxSizing": "border-box"
          },
          "style": {},
          "data": {
            "figmaName": "Frame 479",
            "figmaId": "163:7115"
          },
          "children": [
            {
              "key": "enter-phone-number",
              "tag": "span",
              "layout": {
                "display": "inline-flex"
              },
              "style": {},
              "text": {
                "content": "Enter phone number",
                "style": "paragraph-lg",
                "weight": 400,
                "editable": true,
                "color": {
                  "token": "color.text-tertiary"
                }
              },
              "data": {
                "figmaName": "Enter phone number",
                "figmaId": "163:7101"
              }
            }
          ]
        }
      ]
    }
  ]
};

export function phoneInputTemplate(props?: Record<string, unknown>): ComponentSpec {
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
