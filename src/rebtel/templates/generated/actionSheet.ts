// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "action-sheet",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "column",
    "width": 390,
    "align": "center",
    "justify": "end",
    "gap": "20px",
    "padding": {
      "top": "8px",
      "right": "16px",
      "left": "16px"
    },
    "boxSizing": "border-box",
    "overflow": "hidden"
  },
  "style": {
    "background": {
      "token": "color.surface-primary-lighter"
    }
  },
  "data": {
    "figmaName": "Action sheet",
    "figmaId": "5405:106196"
  },
  "children": [
    {
      "key": "frame-266",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "column",
        "width": "100%",
        "align": "center",
        "gap": {
          "token": "spacing.md"
        },
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Frame 266",
        "figmaId": "I5405:106196;12621:25581"
      },
      "children": [
        {
          "key": "you-re-out-of-minutes",
          "tag": "span",
          "layout": {
            "display": "inline-flex"
          },
          "style": {},
          "text": {
            "content": "You're out of minutes",
            "style": "paragraph-xl",
            "weight": 400,
            "editable": true,
            "color": {
              "token": "color.text-primary"
            }
          },
          "data": {
            "figmaName": "You're out of minutes",
            "figmaId": "I5405:106196;12621:25585"
          }
        },
        {
          "key": "secondary",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "row",
            "width": 360,
            "height": 64,
            "align": "center",
            "justify": "center",
            "gap": {
              "token": "spacing.xs"
            },
            "padding": {
              "right": {
                "token": "spacing.xxl"
              },
              "left": {
                "token": "spacing.xxl"
              }
            },
            "borderRadius": "32px",
            "boxSizing": "border-box"
          },
          "style": {
            "background": {
              "token": "color.surface-button-secondary-black"
            }
          },
          "data": {
            "figmaName": "Secondary",
            "figmaId": "I5405:106196;12621:25599"
          },
          "children": [
            {
              "key": "add-minutes",
              "tag": "span",
              "layout": {
                "display": "inline-flex"
              },
              "style": {},
              "text": {
                "content": "Add minutes",
                "style": "paragraph-xl",
                "weight": 400,
                "editable": true,
                "color": {
                  "token": "color.text-white-constant"
                }
              },
              "data": {
                "figmaName": "Add minutes",
                "figmaId": "I5405:106196;12621:25601"
              }
            }
          ]
        }
      ]
    }
  ]
};

export function actionSheetTemplate(props?: Record<string, unknown>): ComponentSpec {
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
