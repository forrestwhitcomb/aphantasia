// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "state-default",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "column",
    "width": 390,
    "gap": "10px",
    "padding": {
      "top": {
        "token": "spacing.xl"
      },
      "right": {
        "token": "spacing.md"
      },
      "bottom": "52px",
      "left": {
        "token": "spacing.md"
      }
    },
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
    "figmaName": "State=Default",
    "figmaId": "190:9961"
  },
  "children": [
    {
      "key": "frame-536",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "column",
        "width": "100%",
        "gap": {
          "token": "spacing.md"
        },
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Frame 536",
        "figmaId": "190:9914"
      },
      "children": [
        {
          "key": "rebtel-credits",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "row",
            "width": "100%",
            "align": "center",
            "justify": "space-between",
            "gap": "8px",
            "boxSizing": "border-box"
          },
          "style": {},
          "data": {
            "figmaName": "Rebtel Credits",
            "figmaId": "190:9934"
          },
          "children": [
            {
              "key": "use-rebtel-credits",
              "tag": "span",
              "layout": {
                "display": "inline-flex"
              },
              "style": {},
              "text": {
                "content": "Use Rebtel Credits",
                "style": "paragraph-md",
                "weight": 400,
                "editable": true,
                "color": {
                  "token": "color.text-secondary"
                }
              },
              "data": {
                "figmaName": "Use Rebtel Credits",
                "figmaId": "190:9933"
              }
            },
            {
              "key": "frame-537",
              "tag": "div",
              "layout": {
                "display": "flex",
                "direction": "row",
                "align": "center",
                "justify": "end",
                "gap": {
                  "token": "spacing.xs"
                },
                "boxSizing": "border-box"
              },
              "style": {},
              "data": {
                "figmaName": "Frame 537",
                "figmaId": "190:9959"
              },
              "children": [
                {
                  "key": "1-24",
                  "tag": "span",
                  "layout": {
                    "display": "inline-flex"
                  },
                  "style": {},
                  "text": {
                    "content": "$1.24",
                    "style": "paragraph-md",
                    "weight": 400,
                    "editable": true,
                    "color": {
                      "token": "color.text-secondary"
                    }
                  },
                  "data": {
                    "figmaName": "$1.24",
                    "figmaId": "190:9960"
                  }
                }
              ]
            }
          ]
        },
        {
          "key": "dropdown-payment",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "row",
            "width": "100%",
            "height": 52,
            "align": "center",
            "justify": "space-between",
            "gap": "12px",
            "padding": {
              "all": {
                "token": "spacing.sm"
              }
            },
            "borderRadius": "8px",
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
            "figmaName": "Dropdown/Payment",
            "figmaId": "190:9937"
          },
          "children": [
            {
              "key": "payment-info",
              "tag": "div",
              "layout": {
                "display": "flex",
                "direction": "row",
                "width": "100%",
                "align": "center",
                "gap": {
                  "token": "spacing.sm"
                },
                "boxSizing": "border-box"
              },
              "style": {},
              "data": {
                "figmaName": "Payment info",
                "figmaId": "I190:9937;190:9922"
              },
              "children": [
                {
                  "key": "1000",
                  "tag": "span",
                  "layout": {
                    "display": "inline-flex"
                  },
                  "style": {},
                  "text": {
                    "content": "**** 1000",
                    "style": "paragraph-md",
                    "weight": 400,
                    "editable": true,
                    "color": {
                      "token": "color.text-primary"
                    }
                  },
                  "data": {
                    "figmaName": "**** 1000",
                    "figmaId": "I190:9937;190:9917"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "primary",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "width": "100%",
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
        "background": "#E31B3B"
      },
      "data": {
        "figmaName": "Primary",
        "figmaId": "190:9906"
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
            "content": "Pay $5",
            "style": "paragraph-xl",
            "weight": 400,
            "editable": true,
            "color": {
              "token": "color.text-white-constant"
            }
          },
          "data": {
            "figmaName": "Label",
            "figmaId": "I190:9906;28:21888"
          }
        }
      ]
    }
  ]
};

export function paymentSheetTemplate(props?: Record<string, unknown>): ComponentSpec {
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
