/// <reference path="../fourslash.ts" />

// @Filename: /target.ts
//// import { r } from "./file1";
//// const a = r;
//// [|const b = 2;|]
//// const c = 3;
//// [||]
//// const d = 4;

// @Filename: /file1.ts
//// import { aa, bb } from "./other";
//// export const r = 10;
//// const s = 12;
//// export const m = 10;
//// [|export const t = aa + bb + r + s;
//// const u = 1;|]
//// [|export const k = r + m;|]

// @Filename: /other.ts
//// export const aa = 1;
//// export const bb = 2;

// @Filename: /tsconfig.json
////{ "files": ["file1.ts", "target.ts", "other.ts"] }

const ranges = test.ranges();
verify.pasteEdits({
    args: {
        pastedText: [ `export const t = aa + bb + r + s;
const u = 1;`, `export const k = r + m;`],
    pasteLocations: [ranges[0], ranges[1]],
    copiedFrom: { file: "file1.ts", range: [ranges[2], ranges[3]] },
    },
    newFileContents: {
        "/file1.ts":`import { aa, bb } from "./other";
export const r = 10;
export const s = 12;
export const m = 10;
export const t = aa + bb + r + s;
const u = 1;
export const k = r + m;`,
        "/target.ts":
`import { m, r, s } from "./file1";
import { aa, bb } from "./other";
const a = r;
export const t = aa + bb + r + s;
const u = 1;
const c = 3;
export const k = r + m;
const d = 4;`
    }
});