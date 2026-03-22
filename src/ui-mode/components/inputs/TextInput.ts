// TextInput — Form text field
// Variants: "default" | "with-icon" | "with-label" | "multiline"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface TextInputProps extends UIComponentPropsBase {
  placeholder?: string;
  fieldLabel?: string;
  variant?: "default" | "with-icon" | "with-label" | "multiline";
}

export function renderTextInput(props: Partial<TextInputProps> = {}): string {
  const variant = props.variant ?? "with-label";
  const placeholder = props.placeholder ?? "Enter text...";
  const fieldLabel = props.label ?? props.fieldLabel ?? "Label";

  if (variant === "multiline") {
    return `
<div class="ui-input-wrap" data-component="textInput">
  <label class="ui-input__label">${fieldLabel}</label>
  <div class="ui-textarea">
    <span class="ui-textarea__placeholder">${placeholder}</span>
  </div>
</div>`;
  }

  if (variant === "with-icon") {
    return `
<div class="ui-input-wrap" data-component="textInput">
  <div class="ui-input ui-input--with-icon">
    <span class="ui-input__icon">${ICONS.search}</span>
    <span class="ui-input__placeholder">${placeholder}</span>
  </div>
</div>`;
  }

  if (variant === "with-label") {
    return `
<div class="ui-input-wrap" data-component="textInput">
  <label class="ui-input__label">${fieldLabel}</label>
  <div class="ui-input">
    <span class="ui-input__placeholder">${placeholder}</span>
  </div>
</div>`;
  }

  // default
  return `
<div class="ui-input-wrap" data-component="textInput">
  <div class="ui-input">
    <span class="ui-input__placeholder">${placeholder}</span>
  </div>
</div>`;
}
