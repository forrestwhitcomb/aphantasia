// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "balance",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "row",
    "justify": "center",
    "gap": {
      "token": "spacing.xxs"
    },
    "padding": {
      "top": {
        "token": "spacing.xl"
      },
      "bottom": {
        "token": "spacing.xl"
      }
    },
    "boxSizing": "border-box"
  },
  "style": {},
  "data": {
    "figmaName": "Balance",
    "figmaId": "5405:106767"
  },
  "children": [
    {
      "key": "node-5405-106768",
      "tag": "span",
      "layout": {
        "display": "inline-flex"
      },
      "style": {},
      "text": {
        "content": "$",
        "style": "display-xs",
        "weight": 400,
        "editable": false,
        "color": {
          "token": "color.text-primary"
        }
      },
      "data": {
        "figmaName": "$",
        "figmaId": "5405:106768"
      }
    },
    {
      "key": "24",
      "tag": "span",
      "layout": {
        "display": "inline-flex"
      },
      "style": {},
      "text": {
        "content": "24",
        "style": "display-md",
        "weight": 400,
        "editable": true,
        "color": {
          "token": "color.text-primary"
        }
      },
      "data": {
        "figmaName": "24",
        "figmaId": "5405:106769"
      }
    },
    {
      "key": "00",
      "tag": "span",
      "layout": {
        "display": "inline-flex"
      },
      "style": {},
      "text": {
        "content": ".00",
        "style": "display-xs",
        "weight": 400,
        "editable": true,
        "color": {
          "token": "color.text-primary"
        }
      },
      "data": {
        "figmaName": ".00",
        "figmaId": "5405:106770"
      }
    }
  ]
};

export function textBlockTemplate(props?: Record<string, unknown>): ComponentSpec {
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
