// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
// Variants: primary (28:21887), secondary (28:21948), secondary-white (28:21995), secondary-grey (56:544)
// Missing VariableIDs for Step 7 audit: 64:1330→surface-button-primary, 65:1355→surface-button-secondary-white, 65:1356→surface-button-secondary-grey, 65:1340→text-black-constant
import type { ComponentSpec } from "../../spec/types";

const VARIANTS: Record<string, ComponentSpec> = {
  "primary": {
  "key": "button-primary",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "row",
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
    "background": {
      "token": "color.surface-button-primary"
    }
  },
  "data": {
    "figmaName": "button-primary",
    "figmaId": "28:21887"
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
        "content": "Label",
        "style": "paragraph-xl",
        "weight": 400,
        "editable": true,
        "color": {
          "token": "color.text-white-constant"
        }
      },
      "data": {
        "figmaName": "Label",
        "figmaId": "28:21887-label"
      }
    }
  ]
},
  "secondary": {
  "key": "button-secondary",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "row",
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
    "background": {
      "token": "color.surface-button-secondary-black"
    }
  },
  "data": {
    "figmaName": "button-secondary",
    "figmaId": "28:21948"
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
        "content": "Label",
        "style": "paragraph-xl",
        "weight": 400,
        "editable": true,
        "color": {
          "token": "color.text-white-constant"
        }
      },
      "data": {
        "figmaName": "Label",
        "figmaId": "28:21948-label"
      }
    }
  ]
},
  "secondary-white": {
  "key": "button-secondary-white",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "row",
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
    "background": {
      "token": "color.surface-button-secondary-white"
    }
  },
  "data": {
    "figmaName": "button-secondary-white",
    "figmaId": "28:21995"
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
        "content": "Label",
        "style": "paragraph-xl",
        "weight": 400,
        "editable": true,
        "color": {
          "token": "color.text-black-constant"
        }
      },
      "data": {
        "figmaName": "Label",
        "figmaId": "28:21995-label"
      }
    }
  ]
},
  "secondary-grey": {
  "key": "button-secondary-grey",
  "tag": "div",
  "layout": {
    "display": "flex",
    "direction": "row",
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
    "background": {
      "token": "color.surface-button-secondary-grey"
    }
  },
  "data": {
    "figmaName": "button-secondary-grey",
    "figmaId": "56:544"
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
        "content": "Label",
        "style": "paragraph-xl",
        "weight": 400,
        "editable": true,
        "color": {
          "token": "color.text-primary"
        }
      },
      "data": {
        "figmaName": "Label",
        "figmaId": "56:544-label"
      }
    }
  ]
}
};

export function buttonTemplate(props?: Record<string, unknown>): ComponentSpec {
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
