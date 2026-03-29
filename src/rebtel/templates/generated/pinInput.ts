// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "pin-input",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "row",
    "gap": "11px",
    "justify": "center",
    "boxSizing": "border-box"
  },
  "style": {},
  "data": {
    "figmaName": "Pin input",
    "figmaId": "5405:106149"
  },
  "children": [
    {
      "key": "digit-0",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "width": 77,
        "height": 75,
        "align": "center",
        "justify": "center",
        "borderRadius": "16px",
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
        "figmaName": "Enter number container",
        "figmaId": "5405:106150"
      },
      "children": [
        {
          "key": "1",
          "tag": "span",
          "layout": {
            "display": "inline-flex"
          },
          "style": {},
          "text": {
            "content": "1",
            "style": "display-lg",
            "weight": 400,
            "editable": false,
            "color": "#000000"
          },
          "data": {
            "figmaName": "1",
            "figmaId": "5405:106151"
          }
        }
      ]
    },
    {
      "key": "digit-1",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "width": 77,
        "height": 75,
        "align": "center",
        "justify": "center",
        "borderRadius": "16px",
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
        "figmaName": "Enter number container",
        "figmaId": "5405:106152"
      },
      "children": [
        {
          "key": "9",
          "tag": "span",
          "layout": {
            "display": "inline-flex"
          },
          "style": {},
          "text": {
            "content": "9",
            "style": "display-lg",
            "weight": 400,
            "editable": false,
            "color": "#000000"
          },
          "data": {
            "figmaName": "9",
            "figmaId": "5405:106153"
          }
        }
      ]
    },
    {
      "key": "digit-2",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "width": 77,
        "height": 75,
        "align": "center",
        "borderRadius": "16px",
        "boxSizing": "border-box"
      },
      "style": {
        "background": {
          "token": "color.surface-primary-lighter"
        },
        "border": {
          "width": "1px",
          "style": "solid",
          "color": "#E31B3B"
        }
      },
      "data": {
        "figmaName": "Enter number container",
        "figmaId": "5405:106154"
      }
    },
    {
      "key": "digit-3",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "width": 77,
        "height": 75,
        "align": "center",
        "borderRadius": "16px",
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
        "figmaName": "Enter number container",
        "figmaId": "5405:106155"
      }
    }
  ]
};

export function pinInputTemplate(props?: Record<string, unknown>): ComponentSpec {
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
