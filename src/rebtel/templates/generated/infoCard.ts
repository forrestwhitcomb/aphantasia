// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "card-info",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "column",
    "gap": {
      "token": "spacing.sm"
    },
    "boxSizing": "border-box"
  },
  "style": {},
  "data": {
    "figmaName": "Card info",
    "figmaId": "5405:107498"
  },
  "children": [
    {
      "key": "frame-471",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "column",
        "width": 360,
        "gap": {
          "token": "spacing.md"
        },
        "padding": {
          "all": {
            "token": "spacing.md"
          }
        },
        "borderRadius": "8px",
        "boxSizing": "border-box"
      },
      "style": {
        "background": "#FFFFFF",
        "border": {
          "width": "1px",
          "style": "solid",
          "color": {
            "token": "color.border-tertiary"
          }
        }
      },
      "data": {
        "figmaName": "Frame 471",
        "figmaId": "5405:107499"
      },
      "children": [
        {
          "key": "frame-486",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "column",
            "width": "100%",
            "gap": {
              "token": "spacing.xs"
            },
            "boxSizing": "border-box"
          },
          "style": {},
          "data": {
            "figmaName": "Frame 486",
            "figmaId": "5405:107500"
          },
          "children": [
            {
              "key": "frame-331925",
              "tag": "div",
              "layout": {
                "display": "flex",
                "direction": "row",
                "width": "100%",
                "align": "center",
                "gap": {
                  "token": "spacing.xs"
                },
                "boxSizing": "border-box"
              },
              "style": {},
              "data": {
                "figmaName": "Frame 331925",
                "figmaId": "5405:107502"
              }
            }
          ]
        }
      ]
    }
  ]
};

export function infoCardTemplate(props?: Record<string, unknown>): ComponentSpec {
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
