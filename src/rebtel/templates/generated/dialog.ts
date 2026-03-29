// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "type-default",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "column",
    "width": "100%",
    "align": "center",
    "gap": {
      "token": "spacing.xxl"
    },
    "padding": {
      "top": {
        "token": "spacing.xl"
      },
      "right": {
        "token": "spacing.lg"
      },
      "bottom": {
        "token": "spacing.xl"
      },
      "left": {
        "token": "spacing.lg"
      }
    },
    "borderRadius": "16px",
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
    "figmaName": "Type=default",
    "figmaId": "1530:11317"
  },
  "children": [
    {
      "key": "frame-736",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "column",
        "width": "100%",
        "align": "center",
        "gap": {
          "token": "spacing.sm"
        },
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Frame 736",
        "figmaId": "1530:11318"
      },
      "children": [
        {
          "key": "content",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "column",
            "width": "100%",
            "align": "center",
            "gap": {
              "token": "spacing.xxs"
            },
            "boxSizing": "border-box"
          },
          "style": {},
          "data": {
            "figmaName": "Content",
            "figmaId": "1530:11321"
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
                "content": "Confirm the 30-day NGN 7650 auto top-up for Buyaka",
                "style": "paragraph-xl",
                "weight": 400,
                "editable": true,
                "color": {
                  "token": "color.text-primary"
                }
              },
              "data": {
                "figmaName": "Headline",
                "figmaId": "1530:11322"
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
                "content": "Would you like to set up an auto top-up for Buyaka with NGN 7650 every 30 days? You can cancel anytime you want.",
                "style": "paragraph-md",
                "weight": 400,
                "editable": true,
                "color": {
                  "token": "color.text-secondary"
                }
              },
              "data": {
                "figmaName": "Body",
                "figmaId": "1530:11323"
              }
            }
          ]
        }
      ]
    },
    {
      "key": "button-combinations",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "column",
        "width": 310,
        "gap": {
          "token": "spacing.sm"
        },
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Button combinations",
        "figmaId": "1530:11324"
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
            "content": "Yes, activate",
            "style": "paragraph-md",
            "weight": 400,
            "editable": true,
            "color": {
              "token": "color.text-white-constant"
            }
          },
          "data": {
            "figmaName": "Label",
            "figmaId": "I1530:11324;202:6460;28:21955"
          }
        },
        {
          "key": "label",
          "tag": "span",
          "layout": {
            "display": "inline-flex"
          },
          "style": {},
          "text": {
            "content": "No, cancel",
            "style": "paragraph-md",
            "weight": 400,
            "editable": true,
            "color": {
              "token": "color.text-primary"
            }
          },
          "data": {
            "figmaName": "Label",
            "figmaId": "I1530:11324;202:6461;392:23259"
          }
        }
      ]
    }
  ]
};

export function dialogTemplate(props?: Record<string, unknown>): ComponentSpec {
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
