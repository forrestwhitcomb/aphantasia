// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "version-home",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "row",
    "width": "100%",
    "height": 90,
    "align": "center",
    "boxSizing": "border-box"
  },
  "style": {
    "background": "#FAFAFC"
  },
  "data": {
    "figmaName": "Version=Home",
    "figmaId": "3830:21606"
  },
  "children": [
    {
      "key": "livingroom",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "column",
        "width": 130,
        "height": 56,
        "align": "center",
        "justify": "center",
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Livingroom",
        "figmaId": "3830:21608"
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
            "content": "Home",
            "style": "paragraph-xs",
            "weight": 400,
            "editable": true,
            "color": {
              "token": "color.text-primary"
            }
          },
          "data": {
            "figmaName": "Label",
            "figmaId": "3830:21612"
          }
        }
      ]
    },
    {
      "key": "marketplace",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "column",
        "width": 130,
        "height": 56,
        "align": "center",
        "justify": "center",
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Marketplace",
        "figmaId": "3830:21613"
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
            "content": "Services",
            "style": "paragraph-xs",
            "weight": 400,
            "editable": true,
            "color": {
              "token": "color.text-secondary"
            }
          },
          "data": {
            "figmaName": "Label",
            "figmaId": "3830:21616"
          }
        }
      ]
    },
    {
      "key": "account",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "column",
        "width": 130,
        "height": 56,
        "align": "center",
        "justify": "center",
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Account",
        "figmaId": "3830:21617"
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
            "content": "Account",
            "style": "paragraph-xs",
            "weight": 400,
            "editable": true,
            "color": {
              "token": "color.text-secondary"
            }
          },
          "data": {
            "figmaName": "Label",
            "figmaId": "3830:21620"
          }
        }
      ]
    }
  ]
};

export function tabBarTemplate(props?: Record<string, unknown>): ComponentSpec {
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
