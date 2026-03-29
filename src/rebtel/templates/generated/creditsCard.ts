// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const VARIANTS: Record<string, ComponentSpec> = {
  "collapsed": {
  "key": "rebtel-credits",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "row",
    "width": 358,
    "justify": "space-between",
    "gap": "37px",
    "boxSizing": "border-box"
  },
  "style": {},
  "data": {
    "figmaName": "Rebtel credits",
    "figmaId": "5405:106809"
  },
  "children": [
    {
      "key": "frame-470",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "column",
        "gap": {
          "token": "spacing.xs"
        },
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Frame 470",
        "figmaId": "5405:106810"
      },
      "children": [
        {
          "key": "rebtel-credits",
          "tag": "span",
          "layout": {
            "display": "inline-flex"
          },
          "style": {},
          "text": {
            "content": "Rebtel credits",
            "style": "paragraph-md",
            "weight": 400,
            "editable": true,
            "color": {
              "token": "color.text-secondary"
            }
          },
          "data": {
            "figmaName": "Rebtel credits",
            "figmaId": "5405:106811"
          }
        },
        {
          "key": "24-24",
          "tag": "span",
          "layout": {
            "display": "inline-flex"
          },
          "style": {},
          "text": {
            "content": "$24.24",
            "style": "display-md",
            "weight": 400,
            "editable": true,
            "color": {
              "token": "color.text-primary"
            }
          },
          "data": {
            "figmaName": "$24.24",
            "figmaId": "5405:106812"
          }
        }
      ]
    },
    {
      "key": "primary",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "align": "center",
        "justify": "center",
        "gap": {
          "token": "spacing.xxs"
        },
        "padding": {
          "right": {
            "token": "spacing.xl"
          },
          "left": {
            "token": "spacing.xl"
          }
        },
        "borderRadius": "32px",
        "boxSizing": "border-box"
      },
      "style": {
        "background": {
          "token": "color.surface-button-primary"
        }
      },
      "data": {
        "figmaName": "Primary",
        "figmaId": "5405:106813"
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
            "content": "Add credits",
            "style": "paragraph-md",
            "weight": 400,
            "editable": true,
            "color": {
              "token": "color.text-white-constant"
            }
          },
          "data": {
            "figmaName": "Label",
            "figmaId": "I5405:106813;28:21880"
          }
        }
      ]
    }
  ]
},
  "expanded": {
  "key": "credits",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "column",
    "width": 358,
    "gap": {
      "token": "spacing.md"
    },
    "boxSizing": "border-box"
  },
  "style": {},
  "data": {
    "figmaName": "Credits",
    "figmaId": "5405:106771"
  },
  "children": [
    {
      "key": "toggle",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "width": "100%",
        "gap": {
          "token": "spacing.xs"
        },
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Toggle",
        "figmaId": "5405:106772"
      },
      "children": [
        {
          "key": "button-tab",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "row",
            "width": "100%",
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
            "figmaName": "button tab",
            "figmaId": "5405:106773"
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
                "content": "Buy Credits",
                "style": "paragraph-sm",
                "weight": 400,
                "editable": true,
                "color": {
                  "token": "color.text-white-constant"
                }
              },
              "data": {
                "figmaName": "Label",
                "figmaId": "I5405:106773;157:3412"
              }
            }
          ]
        },
        {
          "key": "button-tab",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "row",
            "width": "100%",
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
            "background": "#F3F3F3"
          },
          "data": {
            "figmaName": "button tab",
            "figmaId": "5405:106774"
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
                "content": "Activity",
                "style": "paragraph-sm",
                "weight": 400,
                "editable": true,
                "color": {
                  "token": "color.text-primary"
                }
              },
              "data": {
                "figmaName": "Label",
                "figmaId": "I5405:106774;157:3417"
              }
            }
          ]
        }
      ]
    },
    {
      "key": "value-container",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "column",
        "width": "100%",
        "align": "center",
        "gap": {
          "token": "spacing.lg"
        },
        "padding": {
          "bottom": {
            "token": "spacing.xxl"
          }
        },
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
        "figmaName": "Value container",
        "figmaId": "5405:106775"
      },
      "children": [
        {
          "key": "price-container",
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
            "figmaName": "Price container",
            "figmaId": "5405:106776"
          },
          "children": [
            {
              "key": "frame-694",
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
                "figmaName": "Frame 694",
                "figmaId": "5405:106777"
              },
              "children": [
                {
                  "key": "tertiary",
                  "tag": "div",
                  "layout": {
                    "display": "flex",
                    "direction": "row",
                    "width": "100%",
                    "align": "center",
                    "justify": "center",
                    "gap": {
                      "token": "spacing.xs"
                    },
                    "padding": {
                      "right": {
                        "token": "spacing.xl"
                      },
                      "left": {
                        "token": "spacing.xl"
                      }
                    },
                    "borderRadius": "8px",
                    "boxSizing": "border-box"
                  },
                  "style": {
                    "background": {
                      "token": "color.surface-primary-transparent"
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
                    "figmaName": "Tertiary",
                    "figmaId": "5405:106778"
                  }
                },
                {
                  "key": "tertiary",
                  "tag": "div",
                  "layout": {
                    "display": "flex",
                    "direction": "row",
                    "width": "100%",
                    "align": "center",
                    "justify": "center",
                    "gap": {
                      "token": "spacing.xs"
                    },
                    "padding": {
                      "right": {
                        "token": "spacing.xl"
                      },
                      "left": {
                        "token": "spacing.xl"
                      }
                    },
                    "borderRadius": "8px",
                    "boxSizing": "border-box"
                  },
                  "style": {
                    "background": {
                      "token": "color.surface-primary-transparent"
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
                    "figmaName": "Tertiary",
                    "figmaId": "5405:106779"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
};

export function creditsCardTemplate(props?: Record<string, unknown>): ComponentSpec {
  const variant = (props?.variant as string) ?? Object.keys(VARIANTS)[0];
  const spec = JSON.parse(JSON.stringify(VARIANTS[variant] ?? VARIANTS[Object.keys(VARIANTS)[0]])) as ComponentSpec;
  if (props) applyTextOverrides(spec, props);
  return spec;
}

function applyTextOverrides(spec: ComponentSpec, props: Record<string, unknown>) {
  if (spec.text?.editable && spec.data?.figmaName && props[spec.data.figmaName] !== undefined) {
    spec.text.content = String(props[spec.data.figmaName]);
  }
  spec.children?.forEach(c => applyTextOverrides(c, props));
}
