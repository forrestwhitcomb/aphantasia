// ============================================================
// Figma Variable ID → Token Path Map
// ============================================================
// Auto-generated from Rebtel 3.0 Design System Figma file.
// Maps every VariableID to its TOKEN_MAP dot-path so that
// figmaNodeToSpec() can convert boundVariables to TokenRefs.
// ============================================================

import type { TokenRef } from "../spec/types";

// ── 1 · Primitives (45 vars) ─────────────────────────────────

const PRIMITIVES: Record<string, string> = {
  "VariableID:5222:11926": "color.brand-red",
  "VariableID:5222:11927": "color.brand-black",
  "VariableID:5222:11928": "color.brand-white",
  "VariableID:5222:11929": "color.grey-0",
  "VariableID:5222:11930": "color.grey-100",
  "VariableID:5222:11931": "color.grey-200",
  "VariableID:5222:11932": "color.grey-300",
  "VariableID:5222:11933": "color.grey-400",
  "VariableID:5222:11934": "color.grey-500",
  "VariableID:5222:11935": "color.grey-600",
  "VariableID:5222:11936": "color.grey-700",
  "VariableID:5222:11937": "color.grey-800",
  "VariableID:5222:11938": "color.grey-900",
  "VariableID:5222:11939": "color.grey-900-a40",
  "VariableID:5222:11940": "color.grey-900-a60",
  "VariableID:5222:11941": "color.grey-900-a80",
  "VariableID:5222:11942": "color.grey-100-a0",
  "VariableID:5222:11943": "color.grey-800-a0",
  "VariableID:5222:11944": "color.red-100",
  "VariableID:5222:11945": "color.red-200",
  "VariableID:5222:11946": "color.red-300",
  "VariableID:5222:11947": "color.red-400",
  "VariableID:5222:11948": "color.red-500",
  "VariableID:5222:11949": "color.red-600",
  "VariableID:5222:11950": "color.red-700",
  "VariableID:5222:11951": "color.red-800",
  "VariableID:5222:11952": "color.blue-100",
  "VariableID:5222:11953": "color.blue-200",
  "VariableID:5222:11954": "color.blue-300",
  "VariableID:5222:11955": "color.blue-400",
  "VariableID:5222:11956": "color.blue-500",
  "VariableID:5222:11957": "color.blue-600",
  "VariableID:5222:11958": "color.blue-700",
  "VariableID:5222:11959": "color.green-100",
  "VariableID:5222:11960": "color.green-200",
  "VariableID:5222:11961": "color.green-300",
  "VariableID:5222:11962": "color.green-400",
  "VariableID:5222:11963": "color.green-500",
  "VariableID:5222:11964": "color.orange-100",
  "VariableID:5222:11965": "color.orange-200",
  "VariableID:5222:11966": "color.orange-300",
  "VariableID:5222:11967": "color.purple-500",
  "VariableID:5222:11968": "color.shadow-500",
  "VariableID:5222:11969": "color.sand-100",
  "VariableID:5222:11970": "color.cornflower-100",
};

// ── 2 · Alias (61 vars) ─────────────────────────────────────
// Alias variables reference Primitives. Components may bind
// to either Alias or Mapped/Component IDs, so we map them
// through to their corresponding Mapped semantic name.

const ALIAS: Record<string, string> = {
  // Alias collection variables use IDs 5222:11971–5222:12032
  // These map to the same colors as their Mapped counterparts.
  // Figma resolves aliases internally so boundVariables on
  // components typically reference Mapped or Component IDs.
  // We include the semantic Alias names that DO appear in bindings:
  "VariableID:5222:11972": "color.grey-0",        // color/neutral/0
  "VariableID:5222:11973": "color.grey-100",       // color/neutral/100
  "VariableID:5222:11974": "color.grey-200",       // color/neutral/200
  "VariableID:5222:11975": "color.grey-300",       // color/neutral/300
  "VariableID:5222:11976": "color.grey-400",       // color/neutral/400
  "VariableID:5222:11977": "color.grey-500",       // color/neutral/500
  "VariableID:5222:11978": "color.grey-600",       // color/neutral/600
  "VariableID:5222:11979": "color.grey-700",       // color/neutral/700
  "VariableID:5222:11980": "color.grey-800",       // color/neutral/800
  "VariableID:5222:11981": "color.grey-900",       // color/neutral/900
  "VariableID:5222:11982": "color.grey-900-a40",   // color/neutral/900-a40
  "VariableID:5222:11983": "color.grey-900-a60",   // color/neutral/900-a60
  "VariableID:5222:11984": "color.grey-900-a80",   // color/neutral/900-a80
  "VariableID:5222:11985": "color.grey-100-a0",    // color/neutral/100-a0
  "VariableID:5222:11986": "color.grey-800-a0",    // color/neutral/800-a0
  "VariableID:5222:11987": "color.brand-red",      // color/brand/primary
  "VariableID:5222:11988": "color.brand-black",    // color/brand/secondary → brand black
  "VariableID:5222:11989": "color.brand-black",    // color/brand/black
  "VariableID:5222:11990": "color.brand-white",    // color/brand/white
  "VariableID:5222:11991": "color.red-100",        // color/red/100
  "VariableID:5222:11992": "color.red-200",        // color/red/200
  "VariableID:5222:11993": "color.red-300",        // color/red/300
  "VariableID:5222:11994": "color.red-400",        // color/red/400
  "VariableID:5222:11995": "color.red-500",        // color/red/500
  "VariableID:5222:11996": "color.red-600",        // color/red/600
  "VariableID:5222:11997": "color.red-700",        // color/red/700
  "VariableID:5222:11998": "color.red-800",        // color/red/800
  "VariableID:5222:11999": "color.blue-100",       // color/blue/100
  "VariableID:5222:12000": "color.blue-200",       // color/blue/200
  "VariableID:5222:12001": "color.blue-300",       // color/blue/300
  "VariableID:5222:12002": "color.blue-400",       // color/blue/400
  "VariableID:5222:12003": "color.blue-500",       // color/blue/500
  "VariableID:5222:12004": "color.blue-600",       // color/blue/600
  "VariableID:5222:12005": "color.blue-700",       // color/blue/700
  "VariableID:5222:12006": "color.blue-100",       // color/accent/100 → blue-100
  "VariableID:5222:12007": "color.blue-200",       // color/accent/200
  "VariableID:5222:12008": "color.blue-300",       // color/accent/300
  "VariableID:5222:12009": "color.blue-400",       // color/accent/400
  "VariableID:5222:12010": "color.blue-500",       // color/accent/500
  "VariableID:5222:12011": "color.blue-600",       // color/accent/600
  "VariableID:5222:12012": "color.blue-700",       // color/accent/700
  "VariableID:5222:12013": "color.red-100",        // color/error/100
  "VariableID:5222:12014": "color.red-200",        // color/error/200
  "VariableID:5222:12015": "color.red-300",        // color/error/300
  "VariableID:5222:12016": "color.red-400",        // color/error/400
  "VariableID:5222:12017": "color.red-500",        // color/error/500
  "VariableID:5222:12018": "color.red-600",        // color/error/600
  "VariableID:5222:12019": "color.red-700",        // color/error/700
  "VariableID:5222:12020": "color.red-800",        // color/error/800
  "VariableID:5222:12021": "color.green-100",      // color/success/100
  "VariableID:5222:12022": "color.green-200",      // color/success/200
  "VariableID:5222:12023": "color.green-300",      // color/success/300
  "VariableID:5222:12024": "color.green-400",      // color/success/400
  "VariableID:5222:12025": "color.green-500",      // color/success/500
  "VariableID:5222:12026": "color.orange-100",     // color/warning/100
  "VariableID:5222:12027": "color.orange-200",     // color/warning/200
  "VariableID:5222:12028": "color.orange-300",     // color/warning/300
  "VariableID:5222:12029": "color.purple-500",     // color/purple/500
  "VariableID:5222:12030": "color.shadow-500",     // color/shadow/500
  "VariableID:5222:12031": "color.sand-100",       // color/sand/100
  "VariableID:5222:12032": "color.cornflower-100", // color/cornflower/100

  // ── Additional Alias-layer IDs (from "alias" collection) ───
  "VariableID:23:530": "color.content-secondary",  // content/secondary
  "VariableID:23:695": "color.border-secondary",    // border/secondary

  // ── "3 - mapped" collection IDs referenced by components ───
  // These are from the Figma "3 - mapped" collection and appear
  // directly in component boundVariables.
  "VariableID:65:1354": "color.surface-button-secondary-black", // surface/button/secondary-black
  "VariableID:65:1339": "color.text-white-constant",            // text/white-constant
  "VariableID:65:1360": "color.surface-primary-lighter",        // surface/primary/lighter
  "VariableID:65:1366": "color.icon-lightest",                  // icon/ligthest (sic in Figma)
  "VariableID:62:862": "color.border-tertiary",                 // border/tertiary
  "VariableID:62:765": "color.text-secondary",                  // text/secondary
  "VariableID:58:585": "color.text-primary",                    // text/primary
  "VariableID:58:588": "color.icon-primary",                    // icon/primary
  "VariableID:62:766": "color.text-tertiary",                   // text/tertiary
  "VariableID:1163:63226": "color.surface-primary-transparent",  // surface/primary/transparent
  "VariableID:65:1489": "color.surface-primary-light",           // surface/primary/light
  "VariableID:65:1332": "color.surface-button-primary",          // surface/button/primary
  "VariableID:168:31248": "color.surface-label-black",           // surface/label/black
  "VariableID:62:867": "color.icon-tertiary",                    // icon/tertiary

  // ── "1 - primitives" collection IDs referenced by components ──
  // Spacing
  "VariableID:28:773": "spacing.xxxs",     // spacing/xxxs
  "VariableID:28:792": "spacing.xxs",      // spacing/xxs
  "VariableID:28:793": "spacing.xs",       // spacing/xs
  "VariableID:28:794": "spacing.sm",       // spacing/sm
  "VariableID:28:795": "spacing.md",       // spacing/md
  "VariableID:28:796": "spacing.lg",       // spacing/lg
  "VariableID:28:797": "spacing.xl",       // spacing/xl
  "VariableID:28:798": "spacing.xxl",      // spacing/xxl
  "VariableID:175:6382": "spacing.none",   // spacing/none
  // Radius
  "VariableID:28:909": "radius.md",        // radius/md
  "VariableID:28:910": "radius.lg",        // radius/lg
  "VariableID:28:911": "radius.xl",        // radius/xl
  "VariableID:162:5516": "radius.xxl",     // radius/xxl
  // Object height
  "VariableID:404:18686": "height.xs",     // object-height/xs
  "VariableID:393:24019": "height.xl",     // object-height/xl
  "VariableID:393:24020": "height.xxl",    // object-height/xxl
  // Icon size
  "VariableID:65:2639": "icon-size.xxs",   // icon-size/xxs
  "VariableID:28:20457": "icon-size.md",   // icon-size/md
  "VariableID:28:20458": "icon-size.sm",   // icon-size/sm
  "VariableID:28:20459": "icon-size.xs",   // icon-size/xs
  "VariableID:175:6430": "icon-size.xl",   // icon-size/xl
  // Stroke
  "VariableID:1058:62666": "stroke.md",    // stroke/md
  // Font size
  "VariableID:23:148": "font-size.headline-md",   // font/headline/md
  "VariableID:23:152": "font-size.label-xl",      // font/label/xl
  "VariableID:23:153": "font-size.label-lg",      // font/label/lg
  "VariableID:23:154": "font-size.label-md",      // font/label/md
  "VariableID:23:155": "font-size.label-sm",      // font/label/sm
  "VariableID:23:156": "font-size.label-xs",      // font/label/xs
  "VariableID:23:158": "font-size.paragraph-lg",   // font/paragraph/lg
  "VariableID:23:159": "font-size.paragraph-md",   // font/paragraph/md
  "VariableID:23:161": "font-size.paragraph-xs",   // font/paragraph/xs
};

// ── 3 · Mapped (52 vars) ────────────────────────────────────

const MAPPED: Record<string, string> = {
  // Surface
  "VariableID:5222:12034": "color.surface-page-canvas",
  "VariableID:5222:12035": "color.surface-page-default",
  "VariableID:5222:12036": "color.surface-page-raised",
  "VariableID:5222:12037": "color.surface-page-overlay",
  "VariableID:5222:12038": "color.surface-sheet",
  "VariableID:5222:12039": "color.surface-brand-primary",
  "VariableID:5222:12040": "color.surface-brand-pressed",
  "VariableID:5222:12041": "color.surface-brand-subtle",
  "VariableID:5222:12042": "color.surface-accent-primary",
  "VariableID:5222:12043": "color.surface-accent-subtle",
  "VariableID:5222:12044": "color.surface-feedback-error",
  "VariableID:5222:12045": "color.surface-feedback-error-subtle",
  "VariableID:5222:12046": "color.surface-feedback-warning",
  "VariableID:5222:12047": "color.surface-feedback-warning-subtle",
  "VariableID:5222:12048": "color.surface-feedback-success",
  "VariableID:5222:12049": "color.surface-feedback-success-subtle",
  "VariableID:5222:12050": "color.surface-overlay-scrim",
  "VariableID:5222:12051": "color.surface-overlay-scrim-strong",
  "VariableID:5222:12052": "color.surface-overlay-transparent",
  "VariableID:5222:12053": "color.surface-feature-calling",
  "VariableID:5222:12054": "color.surface-feature-mtu",
  // Content
  "VariableID:5222:12055": "color.content-primary",
  "VariableID:5222:12056": "color.content-secondary",
  "VariableID:5222:12057": "color.content-tertiary",
  "VariableID:5222:12058": "color.content-disabled",
  "VariableID:5222:12059": "color.content-inverse",
  "VariableID:5222:12060": "color.content-brand",
  "VariableID:5222:12061": "color.content-accent",
  "VariableID:5222:12062": "color.content-success",
  "VariableID:5222:12063": "color.content-warning",
  "VariableID:5222:12064": "color.content-error",
  // Border
  "VariableID:5222:12065": "color.border-default",
  "VariableID:5222:12066": "color.border-strong",
  "VariableID:5222:12067": "color.border-subtle",
  "VariableID:5222:12068": "color.border-focus",
  "VariableID:5222:12069": "color.border-brand",
  "VariableID:5222:12070": "color.border-accent",
  "VariableID:5222:12071": "color.border-error",
  "VariableID:5222:12072": "color.border-success",
  "VariableID:5222:12073": "color.border-warning",
  // Icon
  "VariableID:5222:12074": "color.icon-primary",
  "VariableID:5222:12075": "color.icon-secondary",
  "VariableID:5222:12076": "color.icon-tertiary",
  "VariableID:5222:12077": "color.icon-disabled",
  "VariableID:5222:12078": "color.icon-inverse",
  "VariableID:5222:12079": "color.icon-brand",
  "VariableID:5222:12080": "color.icon-accent",
  "VariableID:5222:12081": "color.icon-success",
  "VariableID:5222:12082": "color.icon-warning",
  "VariableID:5222:12083": "color.icon-error",
  // Feedback label
  "VariableID:5222:12084": "color.feedback-label-purple",
  "VariableID:5222:12085": "color.feedback-label-dark",
};

// ── 4 · Component (119 vars) ─────────────────────────────────

const COMPONENT: Record<string, string> = {
  // Button — Primary
  "VariableID:5223:12087": "color.button-primary-bg",
  "VariableID:5223:12088": "color.button-primary-bg-pressed",
  "VariableID:5223:12089": "color.button-primary-bg-disabled",
  "VariableID:5223:12090": "color.button-primary-bg-focus",
  "VariableID:5223:12091": "color.button-primary-border",
  "VariableID:5223:12092": "color.button-primary-border-disabled",
  "VariableID:5223:12093": "color.button-primary-border-focus",
  "VariableID:5223:12094": "color.button-primary-text",
  "VariableID:5223:12095": "color.button-primary-text-disabled",
  "VariableID:5223:12096": "color.button-primary-icon",
  "VariableID:5223:12097": "color.button-primary-icon-disabled",
  // Button — Secondary Black
  "VariableID:5223:12098": "color.button-secondary-black-bg",
  "VariableID:5223:12099": "color.button-secondary-black-bg-pressed",
  "VariableID:5223:12100": "color.button-secondary-black-bg-disabled",
  "VariableID:5223:12101": "color.button-secondary-black-bg-focus",
  "VariableID:5223:12102": "color.button-secondary-black-border",
  "VariableID:5223:12103": "color.button-secondary-black-border-disabled",
  "VariableID:5223:12104": "color.button-secondary-black-border-focus",
  "VariableID:5223:12105": "color.button-secondary-black-text",
  "VariableID:5223:12106": "color.button-secondary-black-text-disabled",
  "VariableID:5223:12107": "color.button-secondary-black-icon",
  "VariableID:5223:12108": "color.button-secondary-black-icon-disabled",
  // Button — Secondary White
  "VariableID:5223:12109": "color.button-secondary-white-bg",
  "VariableID:5223:12110": "color.button-secondary-white-bg-pressed",
  "VariableID:5223:12111": "color.button-secondary-white-bg-disabled",
  "VariableID:5223:12112": "color.button-secondary-white-bg-focus",
  "VariableID:5223:12113": "color.button-secondary-white-border",
  "VariableID:5223:12114": "color.button-secondary-white-border-disabled",
  "VariableID:5223:12115": "color.button-secondary-white-border-focus",
  "VariableID:5223:12116": "color.button-secondary-white-text",
  "VariableID:5223:12117": "color.button-secondary-white-text-disabled",
  "VariableID:5223:12118": "color.button-secondary-white-icon",
  "VariableID:5223:12119": "color.button-secondary-white-icon-disabled",
  // Button — Secondary Grey
  "VariableID:5223:12120": "color.button-secondary-grey-bg",
  "VariableID:5223:12121": "color.button-secondary-grey-bg-pressed",
  "VariableID:5223:12122": "color.button-secondary-grey-bg-disabled",
  "VariableID:5223:12123": "color.button-secondary-grey-bg-focus",
  "VariableID:5223:12124": "color.button-secondary-grey-border",
  "VariableID:5223:12125": "color.button-secondary-grey-border-disabled",
  "VariableID:5223:12126": "color.button-secondary-grey-border-focus",
  "VariableID:5223:12127": "color.button-secondary-grey-text",
  "VariableID:5223:12128": "color.button-secondary-grey-text-disabled",
  "VariableID:5223:12129": "color.button-secondary-grey-icon",
  "VariableID:5223:12130": "color.button-secondary-grey-icon-disabled",
  // Button — Ghost
  "VariableID:5223:12131": "color.button-ghost-bg",
  "VariableID:5223:12132": "color.button-ghost-bg-pressed",
  "VariableID:5223:12133": "color.button-ghost-bg-disabled",
  "VariableID:5223:12134": "color.button-ghost-bg-focus",
  "VariableID:5223:12135": "color.button-ghost-border",
  "VariableID:5223:12136": "color.button-ghost-border-disabled",
  "VariableID:5223:12137": "color.button-ghost-border-focus",
  "VariableID:5223:12138": "color.button-ghost-text",
  "VariableID:5223:12139": "color.button-ghost-text-disabled",
  "VariableID:5223:12140": "color.button-ghost-icon",
  "VariableID:5223:12141": "color.button-ghost-icon-disabled",
  // Input
  "VariableID:5223:12142": "color.input-bg",
  "VariableID:5223:12143": "color.input-bg-focus",
  "VariableID:5223:12144": "color.input-bg-disabled",
  "VariableID:5223:12145": "color.input-bg-error",
  "VariableID:5223:12146": "color.input-border",
  "VariableID:5223:12147": "color.input-border-focus",
  "VariableID:5223:12148": "color.input-border-disabled",
  "VariableID:5223:12149": "color.input-border-error",
  "VariableID:5223:12150": "color.input-text",
  "VariableID:5223:12151": "color.input-text-placeholder",
  "VariableID:5223:12152": "color.input-text-disabled",
  "VariableID:5223:12153": "color.input-label",
  "VariableID:5223:12154": "color.input-label-focus",
  "VariableID:5223:12155": "color.input-label-error",
  "VariableID:5223:12156": "color.input-icon",
  "VariableID:5223:12157": "color.input-icon-focus",
  "VariableID:5223:12158": "color.input-icon-disabled",
  "VariableID:5223:12159": "color.input-icon-error",
  // Card
  "VariableID:5223:12160": "color.card-bg",
  "VariableID:5223:12161": "color.card-bg-pressed",
  "VariableID:5223:12162": "color.card-border",
  "VariableID:5223:12163": "color.card-border-pressed",
  "VariableID:5223:12164": "color.card-elevated-bg",
  "VariableID:5223:12165": "color.card-elevated-border",
  // Label
  "VariableID:5223:12166": "color.label-neutral-bg",
  "VariableID:5223:12167": "color.label-neutral-border",
  "VariableID:5223:12168": "color.label-neutral-text",
  "VariableID:5223:12169": "color.label-brand-bg",
  "VariableID:5223:12170": "color.label-brand-border",
  "VariableID:5223:12171": "color.label-brand-text",
  "VariableID:5223:12172": "color.label-accent-bg",
  "VariableID:5223:12173": "color.label-accent-border",
  "VariableID:5223:12174": "color.label-accent-text",
  "VariableID:5223:12175": "color.label-success-bg",
  "VariableID:5223:12176": "color.label-success-border",
  "VariableID:5223:12177": "color.label-success-text",
  "VariableID:5223:12178": "color.label-warning-bg",
  "VariableID:5223:12179": "color.label-warning-border",
  "VariableID:5223:12180": "color.label-warning-text",
  "VariableID:5223:12181": "color.label-error-bg",
  "VariableID:5223:12182": "color.label-error-border",
  "VariableID:5223:12183": "color.label-error-text",
  "VariableID:5223:12184": "color.label-purple-bg",
  "VariableID:5223:12185": "color.label-purple-border",
  "VariableID:5223:12186": "color.label-purple-text",
  // Tab
  "VariableID:5223:12187": "color.tab-bg",
  "VariableID:5223:12188": "color.tab-bg-active",
  "VariableID:5223:12189": "color.tab-border",
  "VariableID:5223:12190": "color.tab-border-active",
  "VariableID:5223:12191": "color.tab-text",
  "VariableID:5223:12192": "color.tab-text-active",
  "VariableID:5223:12193": "color.tab-text-disabled",
  "VariableID:5223:12194": "color.tab-icon",
  "VariableID:5223:12195": "color.tab-icon-active",
  "VariableID:5223:12196": "color.tab-icon-disabled",
  "VariableID:5223:12197": "color.tab-indicator-active",
  // Navigation
  "VariableID:5223:12198": "color.nav-bar-bg",
  "VariableID:5223:12199": "color.nav-bar-border",
  "VariableID:5223:12200": "color.nav-bar-icon",
  "VariableID:5223:12201": "color.nav-bar-icon-active",
  "VariableID:5223:12202": "color.nav-bar-text",
  "VariableID:5223:12203": "color.nav-bar-text-active",
  // Home Card
  "VariableID:5223:12204": "color.home-card-calling-bg",
  "VariableID:5223:12205": "color.home-card-mtu-bg",
};

// ── 5 · Scale (35 vars) ─────────────────────────────────────

const SCALE: Record<string, string> = {
  "VariableID:5224:2080": "spacing.none",
  "VariableID:5224:2081": "spacing.xxxs",
  "VariableID:5224:2082": "spacing.xxs",
  "VariableID:5224:2083": "spacing.xs",
  "VariableID:5224:2084": "spacing.sm",
  "VariableID:5224:2085": "spacing.md",
  "VariableID:5224:2086": "spacing.lg",
  "VariableID:5224:2087": "spacing.xl",
  "VariableID:5224:2088": "spacing.xxl",
  "VariableID:5224:2089": "spacing.xxxl",
  "VariableID:5224:2090": "spacing.xxxxl",
  "VariableID:5224:2091": "radius.xs",
  "VariableID:5224:2092": "radius.sm",
  "VariableID:5224:2093": "radius.md",
  "VariableID:5224:2094": "radius.lg",
  "VariableID:5224:2095": "radius.xl",
  "VariableID:5224:2096": "radius.xxl",
  "VariableID:5224:2097": "height.xs",
  "VariableID:5224:2098": "height.sm",
  "VariableID:5224:2099": "height.md",
  "VariableID:5224:2100": "height.lg",
  "VariableID:5224:2101": "height.xl",
  "VariableID:5224:2102": "height.xxl",
  "VariableID:5224:2103": "height.xxxl",
  "VariableID:5224:2104": "icon-size.xxs",
  "VariableID:5224:2105": "icon-size.xs",
  "VariableID:5224:2106": "icon-size.sm",
  "VariableID:5224:2107": "icon-size.md",
  "VariableID:5224:2108": "icon-size.lg",
  "VariableID:5224:2109": "icon-size.xl",
  "VariableID:5224:2110": "icon-size.xxl",
  "VariableID:5224:2111": "stroke.md",
  "VariableID:5224:2112": "stroke.lg",
  "VariableID:5224:2113": "stroke.xl",
  "VariableID:5224:2114": "stroke.xxl",
};

// ── Merged Map ───────────────────────────────────────────────

export const FIGMA_VARIABLE_TO_TOKEN: Record<string, string> = {
  ...PRIMITIVES,
  ...ALIAS,
  ...MAPPED,
  ...COMPONENT,
  ...SCALE,
};

/**
 * Convert a Figma VariableID to a TokenRef for use in ComponentSpec.
 * Returns null if the variable ID is unknown.
 */
export function figmaVarToTokenRef(variableId: string): TokenRef | null {
  const path = FIGMA_VARIABLE_TO_TOKEN[variableId];
  return path ? { token: path } : null;
}

/**
 * Resolve a boundVariable entry from a Figma node.
 * Handles both { type: "VARIABLE_ALIAS", id: "VariableID:..." }
 * and direct { id: "VariableID:..." } shapes.
 */
export function resolveBoundVariable(
  boundVar: unknown,
): TokenRef | null {
  if (!boundVar || typeof boundVar !== "object") return null;
  const obj = boundVar as Record<string, unknown>;
  const id = obj.id as string | undefined;
  if (!id) return null;
  return figmaVarToTokenRef(id);
}
