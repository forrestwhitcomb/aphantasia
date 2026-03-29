// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "card-calling",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "column",
    "width": 358,
    "gap": {
      "token": "spacing.sm"
    },
    "padding": {
      "all": {
        "token": "spacing.sm"
      }
    },
    "borderRadius": "12px",
    "boxSizing": "border-box"
  },
  "style": {
    "background": "#EDEADD"
  },
  "data": {
    "figmaName": "Card/Calling",
    "figmaId": "5405:106510"
  },
  "children": [
    {
      "key": "top",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "width": "100%",
        "align": "center",
        "justify": "space-between",
        "gap": "4px",
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Top",
        "figmaId": "5405:106511"
      },
      "children": [
        {
          "key": "frame-832",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "row",
            "align": "center",
            "gap": {
              "token": "spacing.xs"
            },
            "boxSizing": "border-box"
          },
          "style": {},
          "data": {
            "figmaName": "Frame 832",
            "figmaId": "5405:106512"
          },
          "children": [
            {
              "key": "action-lavel",
              "tag": "div",
              "layout": {
                "display": "flex",
                "direction": "row",
                "align": "center",
                "justify": "center",
                "gap": "10px",
                "padding": {
                  "top": {
                    "token": "spacing.xxs"
                  },
                  "right": {
                    "token": "spacing.xs"
                  },
                  "bottom": {
                    "token": "spacing.xxs"
                  },
                  "left": {
                    "token": "spacing.xs"
                  }
                },
                "borderRadius": "12px",
                "boxSizing": "border-box"
              },
              "style": {
                "background": "#111111"
              },
              "data": {
                "figmaName": "Action lavel",
                "figmaId": "5405:106513"
              },
              "children": [
                {
                  "key": "calling",
                  "tag": "span",
                  "layout": {
                    "display": "inline-flex"
                  },
                  "style": {},
                  "text": {
                    "content": "Calling",
                    "style": "paragraph-xs",
                    "weight": 400,
                    "editable": true,
                    "color": {
                      "token": "color.text-white-constant"
                    }
                  },
                  "data": {
                    "figmaName": "Calling",
                    "figmaId": "5405:106514"
                  }
                }
              ]
            },
            {
              "key": "10-minutes-ago",
              "tag": "span",
              "layout": {
                "display": "inline-flex"
              },
              "style": {},
              "text": {
                "content": "10 minutes ago",
                "style": "paragraph-xs",
                "weight": 400,
                "editable": true,
                "color": "#505055"
              },
              "data": {
                "figmaName": "10 minutes ago",
                "figmaId": "5405:106515"
              }
            }
          ]
        },
        {
          "key": "icon-more",
          "tag": "div",
          "layout": {
            "display": "block",
            "width": 24,
            "height": 24,
            "boxSizing": "border-box"
          },
          "style": {},
          "data": {
            "figmaName": "icon-more",
            "figmaId": "5405:106516"
          }
        }
      ]
    },
    {
      "key": "contact-info-usage",
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
        "figmaName": "Contact info + Usage",
        "figmaId": "5405:106517"
      },
      "children": [
        {
          "key": "frame-331961",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "column",
            "width": "100%",
            "boxSizing": "border-box"
          },
          "style": {},
          "data": {
            "figmaName": "Frame 331961",
            "figmaId": "5405:106518"
          },
          "children": [
            {
              "key": "flag-profile-container",
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
                "figmaName": "Flag&Profile container",
                "figmaId": "5405:106519"
              },
              "children": [
                {
                  "key": "flag-profile",
                  "tag": "div",
                  "layout": {
                    "display": "block",
                    "width": 56,
                    "height": 32,
                    "boxSizing": "border-box"
                  },
                  "style": {},
                  "data": {
                    "figmaName": "Flag & profile",
                    "figmaId": "5405:106520"
                  }
                },
                {
                  "key": "name",
                  "tag": "span",
                  "layout": {
                    "display": "inline-flex"
                  },
                  "style": {},
                  "text": {
                    "content": "Emil Lee Ann Bergst...",
                    "style": "display-xs",
                    "weight": 400,
                    "editable": true,
                    "color": {
                      "token": "color.text-primary"
                    }
                  },
                  "data": {
                    "figmaName": "Name",
                    "figmaId": "5405:106525"
                  }
                }
              ]
            }
          ]
        },
        {
          "key": "minutes-left",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "row",
            "width": 334,
            "height": 14,
            "align": "end",
            "justify": "space-between",
            "gap": "14px",
            "boxSizing": "border-box"
          },
          "style": {},
          "data": {
            "figmaName": "Minutes left",
            "figmaId": "5405:106526"
          },
          "children": [
            {
              "key": "frame-331956",
              "tag": "div",
              "layout": {
                "display": "flex",
                "direction": "row",
                "width": 197,
                "align": "center",
                "gap": "2px",
                "boxSizing": "border-box"
              },
              "style": {},
              "data": {
                "figmaName": "Frame 331956",
                "figmaId": "5405:106527"
              },
              "children": [
                {
                  "key": "ellipse-2",
                  "tag": "div",
                  "layout": {
                    "display": "flex",
                    "align": "center",
                    "justify": "center",
                    "width": 8,
                    "height": 8,
                    "flexShrink": 0
                  },
                  "style": {
                    "color": "#09BC09"
                  },
                  "data": {
                    "figmaName": "Ellipse 2",
                    "figmaId": "5405:106528",
                    "figmaType": "ELLIPSE",
                    "component": "icon",
                    "iconName": "Ellipse 2"
                  }
                },
                {
                  "key": "340-min-left",
                  "tag": "span",
                  "layout": {
                    "display": "inline-flex"
                  },
                  "style": {},
                  "text": {
                    "content": "340 minutes left",
                    "style": "paragraph-sm",
                    "weight": 400,
                    "editable": true,
                    "color": "#505055"
                  },
                  "data": {
                    "figmaName": "340 min left",
                    "figmaId": "5405:106529"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "secondary",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "width": 334,
        "height": 40,
        "align": "center",
        "justify": "center",
        "gap": {
          "token": "spacing.xxs"
        },
        "padding": {
          "right": {
            "token": "spacing.md"
          },
          "left": {
            "token": "spacing.md"
          }
        },
        "borderRadius": "24px",
        "boxSizing": "border-box"
      },
      "style": {
        "background": {
          "token": "color.surface-button-secondary-black"
        }
      },
      "data": {
        "figmaName": "Secondary",
        "figmaId": "5405:106533"
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
            "content": "Call again",
            "style": "paragraph-sm",
            "weight": 400,
            "editable": true,
            "color": {
              "token": "color.text-white-constant"
            }
          },
          "data": {
            "figmaName": "Label",
            "figmaId": "5405:106535"
          }
        }
      ]
    }
  ]
};

export function contactCardTemplate(props?: Record<string, unknown>): ComponentSpec {
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
