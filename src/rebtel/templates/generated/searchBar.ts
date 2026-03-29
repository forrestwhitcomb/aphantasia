// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "device-ios-size-md-state-inactive",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "row",
    "width": "100%",
    "height": 40,
    "align": "center",
    "gap": {
      "token": "spacing.xxs"
    },
    "padding": {
      "top": {
        "token": "spacing.xs"
      },
      "right": {
        "token": "spacing.sm"
      },
      "bottom": {
        "token": "spacing.xs"
      },
      "left": {
        "token": "spacing.sm"
      }
    },
    "borderRadius": "24px",
    "boxSizing": "border-box",
    "overflow": "hidden"
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
    "figmaName": "Device=iOS, Size=md, state=Inactive",
    "figmaId": "393:23567"
  },
  "children": [
    {
      "key": "input",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "align": "center",
        "gap": "4px",
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Input",
        "figmaId": "393:23553"
      },
      "children": [
        {
          "key": "search-country",
          "tag": "span",
          "layout": {
            "display": "inline-flex"
          },
          "style": {},
          "text": {
            "content": "Search country",
            "style": "paragraph-md",
            "weight": 400,
            "editable": true,
            "color": {
              "token": "color.text-tertiary"
            }
          },
          "data": {
            "figmaName": "Search country",
            "figmaId": "393:23554"
          }
        }
      ]
    }
  ]
};

export function searchBarTemplate(props?: Record<string, unknown>): ComponentSpec {
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
