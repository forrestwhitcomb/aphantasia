// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = {
  "key": "mtu",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "column",
    "width": 358,
    "align": "center",
    "gap": "16px",
    "padding": {
      "all": "16px"
    },
    "borderRadius": "12px",
    "boxSizing": "border-box",
    "overflow": "hidden"
  },
  "style": {
    "background": {
      "token": "color.surface-primary-lighter"
    }
  },
  "data": {
    "figmaName": "MTU",
    "figmaId": "5405:107036"
  },
  "children": [
    {
      "key": "frame-478",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "column",
        "width": "100%",
        "gap": "12px",
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Frame 478",
        "figmaId": "5405:107037"
      },
      "children": [
        {
          "key": "frame-331924",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "row",
            "align": "center",
            "justify": "center",
            "gap": "12px",
            "boxSizing": "border-box"
          },
          "style": {},
          "data": {
            "figmaName": "Frame 331924",
            "figmaId": "5405:107038"
          },
          "children": [
            {
              "key": "phone-ringing-02",
              "tag": "div",
              "layout": {
                "display": "block",
                "width": 32,
                "height": 32,
                "boxSizing": "border-box"
              },
              "style": {},
              "data": {
                "figmaName": "Phone Ringing 02",
                "figmaId": "5405:107039"
              }
            },
            {
              "key": "international-calling",
              "tag": "span",
              "layout": {
                "display": "inline-flex"
              },
              "style": {},
              "text": {
                "content": "International calling",
                "style": "paragraph-lg",
                "weight": 400,
                "editable": true,
                "color": {
                  "token": "color.text-primary"
                }
              },
              "data": {
                "figmaName": "International calling",
                "figmaId": "5405:107040"
              }
            }
          ]
        }
      ]
    },
    {
      "key": "frame-331919",
      "tag": "div",
      "layout": {
        "display": "flex",
        "direction": "row",
        "width": "100%",
        "gap": "16px",
        "boxSizing": "border-box"
      },
      "style": {},
      "data": {
        "figmaName": "Frame 331919",
        "figmaId": "5405:107041"
      },
      "children": [
        {
          "key": "tertiary",
          "tag": "div",
          "layout": {
            "display": "flex",
            "direction": "row",
            "width": "100%",
            "height": 40,
            "align": "center",
            "justify": "center",
            "gap": {
              "token": "spacing.xs"
            },
            "padding": {
              "right": {
                "token": "spacing.lg"
              },
              "left": {
                "token": "spacing.lg"
              }
            },
            "borderRadius": "32px",
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
            "figmaId": "5405:107042"
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
                "content": "Get started with international calling",
                "style": "paragraph-sm",
                "weight": 400,
                "editable": true,
                "color": {
                  "token": "color.text-primary"
                }
              },
              "data": {
                "figmaName": "Label",
                "figmaId": "I5405:107042;392:23265"
              }
            }
          ]
        }
      ]
    }
  ]
};

export function serviceTypeTemplate(props?: Record<string, unknown>): ComponentSpec {
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
