// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "card-welcome-promo",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "row",
    "width": 358,
    "height": 220,
    "align": "center",
    "justify": "space-between",
    "borderRadius": "12px",
    "boxSizing": "border-box",
    "overflow": "hidden"
  },
  "style": {},
  "data": {
    "figmaName": "Card / Welcome Promo",
    "figmaId": "5405:106590"
  },
  "children": [
    {
      "key": "content",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "width": "100%",
        "align": "center",
        "justify": "space-between",
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Content",
        "figmaId": "5405:106591"
      },
      "children": [
        {
          "key": "right-card",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "column",
            "width": 273,
            "justify": "center",
            "gap": "20px",
            "padding": {
              "top": {
                "token": "spacing.md"
              },
              "right": {
                "token": "spacing.md"
              },
              "bottom": {
                "token": "spacing.lg"
              },
              "left": {
                "token": "spacing.md"
              }
            },
            "boxSizing": "border-box"
          },
          "style": {
            "background": "#111111"
          },
          "data": {
            "figmaName": "Right card",
            "figmaId": "5405:106592"
          },
          "children": [
            {
              "key": "wrapper",
              "tag": "div",
              "layout": {
                "display": "flex",
                "direction": "row",
                "width": 218,
                "gap": "10px",
                "boxSizing": "border-box"
              },
              "style": {},
              "data": {
                "figmaName": "Wrapper",
                "figmaId": "5405:106593"
              }
            },
            {
              "key": "content",
              "tag": "div",
              "layout": {
                "display": "flex",
                "direction": "column",
                "width": "100%",
                "gap": {
                  "token": "spacing.xxs"
                },
                "boxSizing": "border-box"
              },
              "style": {},
              "data": {
                "figmaName": "Content",
                "figmaId": "5405:106596"
              },
              "children": [
                {
                  "key": "headline",
                  "tag": "span",
                  "layout": {
                    "display": "inline-flex",
                    "width": "100%"
                  },
                  "style": {},
                  "text": {
                    "content": "Get started with 7 days of free unlimited calls to USA",
                    "style": "paragraph-md",
                    "weight": 400,
                    "editable": true,
                    "color": "#FFFFFF"
                  },
                  "data": {
                    "figmaName": "Headline",
                    "figmaId": "5405:106597"
                  }
                },
                {
                  "key": "body",
                  "tag": "span",
                  "layout": {
                    "display": "inline-flex",
                    "width": "100%"
                  },
                  "style": {},
                  "text": {
                    "content": "Then just $12/month. No contract, just connection. Cancel anytime.",
                    "style": "paragraph-xs",
                    "weight": 400,
                    "editable": true,
                    "color": {
                      "token": "color.text-tertiary"
                    }
                  },
                  "data": {
                    "figmaName": "Body",
                    "figmaId": "5405:106598"
                  }
                },
                {
                  "key": "primary",
                  "tag": "div",
                  "layout": {
                    "display": "flex",
                    "direction": "row",
                    "height": 32,
                    "align": "center",
                    "justify": "center",
                    "gap": {
                      "token": "spacing.xxs"
                    },
                    "padding": {
                      "right": {
                        "token": "spacing.sm"
                      },
                      "left": {
                        "token": "spacing.sm"
                      }
                    },
                    "borderRadius": "24px",
                    "boxSizing": "border-box"
                  },
                  "style": {
                    "background": {
                      "token": "color.surface-button-primary"
                    }
                  },
                  "data": {
                    "figmaName": "Primary",
                    "figmaId": "5405:106599"
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
                        "content": "Start free trial",
                        "style": "paragraph-sm",
                        "weight": 400,
                        "editable": true,
                        "color": {
                          "token": "color.text-white-constant"
                        }
                      },
                      "data": {
                        "figmaName": "Label",
                        "figmaId": "I5405:106599;393:24024"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "key": "left-card-img",
              "tag": "div",
              "layout": {
                "display": "flex",
                "direction": "row",
                "width": 85,
                "align": "center",
                "justify": "space-between",
                "padding": {
                  "all": {
                    "token": "spacing.sm"
                  }
                },
                "boxSizing": "border-box"
              },
              "style": {
                "background": "#111111"
              },
              "data": {
                "figmaName": "Left card img",
                "figmaId": "5405:106600"
              }
            }
          ]
        }
      ]
    }
  ]
};

export function promoCardTemplate(props?: Record<string, unknown>): ComponentSpec {
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
