// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "reciept-module",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "column",
    "width": 350,
    "padding": {
      "top": {
        "token": "spacing.xs"
      },
      "right": {
        "token": "spacing.sm"
      },
      "bottom": {
        "token": "spacing.xl"
      },
      "left": {
        "token": "spacing.sm"
      }
    },
    "borderRadius": "16px",
    "boxSizing": "border-box",
    "overflow": "hidden"
  },
  "style": {
    "background": {
      "token": "color.surface-primary-lighter"
    }
  },
  "data": {
    "figmaName": "Reciept module",
    "figmaId": "5405:106725"
  },
  "children": [
    {
      "key": "order-summary",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "column",
        "width": "100%",
        "gap": {
          "token": "spacing.sm"
        },
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Order summary",
        "figmaId": "I5405:106725;1733:29114"
      },
      "children": [
        {
          "key": "summary",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "column",
            "width": "100%",
            "boxSizing": "border-box"
          },
          "style": {},
          "data": {
            "figmaName": "Summary",
            "figmaId": "I5405:106725;1734:22201"
          },
          "children": [
            {
              "key": "reciever",
              "tag": "div",
              "layout": {
                "display": "flex",
                "direction": "column",
                "width": "100%",
                "gap": "2px",
                "padding": {
                  "top": "8px",
                  "bottom": "8px"
                },
                "boxSizing": "border-box"
              },
              "style": {},
              "data": {
                "figmaName": "Reciever",
                "figmaId": "I5405:106725;1733:29115"
              },
              "children": [
                {
                  "key": "type",
                  "tag": "div",
                  "layout": {
                    "display": "flex",
                    "direction": "row",
                    "width": "100%",
                    "justify": "space-between",
                    "gap": "60px",
                    "boxSizing": "border-box"
                  },
                  "style": {},
                  "data": {
                    "figmaName": "Type",
                    "figmaId": "I5405:106725;1733:29115;190:9246"
                  }
                }
              ]
            }
          ]
        },
        {
          "key": "divider",
          "tag": "div",
          "layout": {
            "display": "flex",
            "align": "center",
            "justify": "center",
            "width": 326,
            "height": 0,
            "flexShrink": 0
          },
          "style": {},
          "data": {
            "figmaName": "Divider",
            "figmaId": "I5405:106725;1733:29128",
            "figmaType": "LINE",
            "component": "icon",
            "iconName": "Divider"
          }
        },
        {
          "key": "total",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "column",
            "width": "100%",
            "boxSizing": "border-box"
          },
          "style": {},
          "data": {
            "figmaName": "Total",
            "figmaId": "I5405:106725;1733:29129"
          },
          "children": [
            {
              "key": "simple-text-list",
              "tag": "div",
              "layout": {
                "display": "flex",
                "direction": "column",
                "width": "100%",
                "boxSizing": "border-box"
              },
              "style": {},
              "data": {
                "figmaName": "simple text list",
                "figmaId": "I5405:106725;1733:29130"
              }
            },
            {
              "key": "disclaimer",
              "tag": "div",
              "layout": {
                "display": "flex",
                "direction": "column",
                "width": "100%",
                "gap": "2px",
                "padding": {
                  "top": {
                    "token": "spacing.xs"
                  },
                  "bottom": {
                    "token": "spacing.xs"
                  }
                },
                "boxSizing": "border-box"
              },
              "style": {},
              "data": {
                "figmaName": "Disclaimer",
                "figmaId": "I5405:106725;1733:29131"
              },
              "children": [
                {
                  "key": "type",
                  "tag": "div",
                  "layout": {
                    "display": "flex",
                    "direction": "row",
                    "width": "100%",
                    "justify": "space-between",
                    "gap": "60px",
                    "boxSizing": "border-box"
                  },
                  "style": {},
                  "data": {
                    "figmaName": "Type",
                    "figmaId": "I5405:106725;1733:29131;190:9246"
                  }
                }
              ]
            }
          ]
        },
        {
          "key": "divider",
          "tag": "div",
          "layout": {
            "display": "flex",
            "align": "center",
            "justify": "center",
            "width": 326,
            "height": 0,
            "flexShrink": 0
          },
          "style": {},
          "data": {
            "figmaName": "Divider",
            "figmaId": "I5405:106725;1734:22202",
            "figmaType": "LINE",
            "component": "icon",
            "iconName": "Divider"
          }
        },
        {
          "key": "disclaimer-payment-info",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "column",
            "width": "100%",
            "justify": "center",
            "gap": {
              "token": "spacing.xs"
            },
            "boxSizing": "border-box"
          },
          "style": {},
          "data": {
            "figmaName": "Disclaimer payment & info",
            "figmaId": "I5405:106725;1733:29132"
          },
          "children": [
            {
              "key": "disclaimer",
              "tag": "div",
              "layout": {
                "display": "flex",
                "direction": "row",
                "width": "100%",
                "align": "center",
                "gap": {
                  "token": "spacing.xxs"
                },
                "boxSizing": "border-box"
              },
              "style": {},
              "data": {
                "figmaName": "Disclaimer",
                "figmaId": "I5405:106725;1733:29132;190:9023"
              },
              "children": [
                {
                  "key": "cancel-anytime",
                  "tag": "span",
                  "layout": {
                    "display": "inline-flex",
                    "width": "100%"
                  },
                  "style": {},
                  "text": {
                    "content": "Cancel anytime",
                    "style": "paragraph-sm",
                    "weight": 400,
                    "editable": true,
                    "color": {
                      "token": "color.text-secondary"
                    }
                  },
                  "data": {
                    "figmaName": "Cancel anytime",
                    "figmaId": "I5405:106725;1733:29132;190:9023;190:9018"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export function orderSummaryTemplate(props?: Record<string, unknown>): ComponentSpec {
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
