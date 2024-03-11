# String Dissect (TypeScript)

[**⚖️** MIT](./LICENSE.md)

**🗂️**
[![GitHub: hugoalh-studio/string-dissect-ts](https://img.shields.io/badge/hugoalh--studio/string--dissect--ts-181717?logo=github&logoColor=ffffff&style=flat "GitHub: hugoalh-studio/string-dissect-ts")](https://github.com/hugoalh-studio/string-dissect-ts)
[![JSR: @hugoalh/string-dissect](https://img.shields.io/badge/JSR-@hugoalh/string--dissect-F7DF1E?labelColor=F7DF1E&logoColor=000000&style=flat "JSR: @hugoalh/string-dissect")](https://jsr.io/@hugoalh/string-dissect)

**🆙** ![Latest Release Version](https://img.shields.io/github/release/hugoalh-studio/string-dissect-ts?sort=semver&color=2187C0&label=&style=flat "Latest Release Version") (![Latest Release Date](https://img.shields.io/github/release-date/hugoalh-studio/string-dissect-ts?color=2187C0&label=&style=flat "Latest Release Date"))

A TypeScript module to dissect the string; Safe with the emojis, URLs, and words.

## 🎯 Target

- Bun ^ v1.0.0
- Cloudflare Workers
- Deno >= v1.34.0 / >= v1.41.1 *(Via JSR)*
  > **🛡️ Require Permission**
  >
  > *N/A*
- NodeJS >= v20.9.0

### 🔗 Other Edition

- [JavaScript](https://github.com/hugoalh-studio/string-dissect-js)

## 🔰 Usage

### Via HTTPS

> **🎯 Supported Target**
>
> - Deno

1. Import at the script (`<ScriptName>.ts`):
    - Via DenoPKG
      ```ts
      import ... from "https://denopkg.com/hugoalh-studio/string-dissect-ts[@<Tag>]/mod.ts";
      ```
    - Via GitHub Raw (Require Tag)
      ```ts
      import ... from "https://raw.githubusercontent.com/hugoalh-studio/string-dissect-ts/<Tag>/mod.ts";
      ```
    - Via Pax
      ```ts
      import ... from "https://pax.deno.dev/hugoalh-studio/string-dissect-ts[@<Tag>]/mod.ts";
      ```
    > **ℹ️ Note**
    >
    > Although it is recommended to import the entire module with the main path `mod.ts`, it is also able to import part of the module with sub path if available, but do not import if:
    >
    > - it's file path has an underscore prefix (e.g.: `_foo.ts`, `_util/bar.ts`), or
    > - it is a benchmark or test file (e.g.: `foo.bench.ts`, `foo.test.ts`), or
    > - it's symbol has an underscore prefix (e.g.: `export function _baz() {}`).
    >
    > These elements are not considered part of the public API, thus no stability is guaranteed for them.

### Via JSR With Native Support

> **🎯 Supported Target**
>
> - Deno

1. Import at the script (`<ScriptName>.ts`):
    ```ts
    import ... from "jsr:@hugoalh/string-dissect[@<Tag>]";
    ```
    > **ℹ️ Note**
    >
    > Although it is recommended to import the entire module, it is also able to import part of the module with sub path if available, please visit [file `jsr.jsonc`](./jsr.jsonc) property `exports` for available sub paths.

### Via JSR With NPM Compatibility Layer Support

> **🎯 Supported Target**
>
> - Bun
> - Cloudflare Workers
> - NodeJS

1. Install via console/shell/terminal:
    - Via Bun
      ```sh
      bunx jsr add @hugoalh/string-dissect[@<Tag>]
      ```
    - Via NPM
      ```sh
      npx jsr add @hugoalh/string-dissect[@<Tag>]
      ```
    - Via PNPM
      ```sh
      pnpm dlx jsr add @hugoalh/string-dissect[@<Tag>]
      ```
    - Via Yarn
      ```sh
      yarn dlx jsr add @hugoalh/string-dissect[@<Tag>]
      ```
2. Import at the script (`<ScriptName>.ts`):
    ```ts
    import ... from "@hugoalh/string-dissect";
    ```
    > **ℹ️ Note**
    >
    > Although it is recommended to import the entire module, it is also able to import part of the module with sub path if available, please visit [file `jsr.jsonc`](./jsr.jsonc) property `exports` for available sub paths.

## 🧩 API

- ```ts
  class StringDissector {
    constructor(options: StringDissectorOptions = {}): StringDissector;
    dissect(item: string, optionsOverride: StringDissectorOptions = {}): Generator<StringSegmentDescriptor>;
    dissectExtend(item: string, optionsOverride: StringDissectorOptions = {}): Generator<StringSegmentDescriptorExtend>;
    static dissect(item: string, options: StringDissectorOptions = {}): Generator<StringSegmentDescriptor>;
    static dissectExtend(item: string, options: StringDissectorOptions = {}): Generator<StringSegmentDescriptorExtend>;
  }
  ```
- ```ts
  function stringDissect(item: string, options: StringDissectorOptions = {}): Generator<StringSegmentDescriptor>;
  ```
- ```ts
  function stringDissectExtend(item: string, options: StringDissectorOptions = {}): Generator<StringSegmentDescriptorExtend>;
  ```
- ```ts
  enum StringSegmentType {
    ansi = "ansi",
    ANSI = "ansi",
    character = "character",
    Character = "character",
    emoji = "emoji",
    Emoji = "emoji",
    url = "url",
    Url = "url",
    URL = "url",
    word = "word",
    Word = "word"
  }
  ```
- ```ts
  interface StringDissectorOptions {
    /**
     * The locale(s) to use in the operation; The JavaScript implementation examines locales, and then computes a locale it understands that comes closest to satisfying the expressed preference. By default, the implementation's default locale will be used. For more information, please visit https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument.
     * @default undefined
     */
    locales?: StringDissectorLocales;
    /**
     * Whether to remove ANSI escape codes.
     * @default false
     */
    removeANSI?: boolean;
    /**
     * Whether to prevent URLs get splitted.
     * @default true
     */
    safeURLs?: boolean;
    /**
     * Whether to prevent words get splitted.
     * @default true
     */
    safeWords?: boolean;
  }
  ```
- ```ts
  interface StringSegmentDescriptor {
    type: StringSegmentType;
    value: string;
  }
  ```
- ```ts
  interface StringSegmentDescriptorExtend extends StringSegmentDescriptor {
    indexEnd: number;
    indexStart: number;
  }
  ```
- ```ts
  type StringDissectorLocales = ConstructorParameters<typeof Intl.Segmenter>[0];
  ```

> **ℹ️ Note**
>
> For the prettier documentation, can visit via:
>
> - [Deno CLI `deno doc`](https://deno.land/manual/tools/documentation_generator)
> - [JSR](https://jsr.io/@hugoalh/string-dissect)

## ✍️ Example

- ```ts
  const sample1 = "Vel ex sit est sit est tempor enim et voluptua consetetur gubergren gubergren ut.";

  /* Either */
  Array.from(new StringDissector().dissect(sample1));
  Array.from(stringDissect(sample1));
  /*=>
  [
    { value: "Vel", type: "word" },
    { value: " ", type: "character" },
    { value: "ex", type: "word" },
    { value: " ", type: "character" },
    { value: "sit", type: "word" },
    { value: " ", type: "character" },
    { value: "est", type: "word" },
    { value: " ", type: "character" },
    ... +20
  ]
  */

  /* Either */
  Array.from(new StringDissector({ safeWords: false }).dissect(sample1));
  Array.from(stringDissect(sample1, { safeWords: false }));
  /*=>
  [
    { value: "V", type: "character" },
    { value: "e", type: "character" },
    { value: "l", type: "character" },
    { value: " ", type: "character" },
    { value: "e", type: "character" },
    { value: "x", type: "character" },
    { value: " ", type: "character" },
    { value: "s", type: "character" },
    ... +73
  ]
  */
  ```
- ```ts
  /* Either */
  Array.from(new StringDissector().dissect("GitHub homepage is https://github.com."));
  Array.from(stringDissect("GitHub homepage is https://github.com."));
  /*=>
  [
    { value: "GitHub", type: "word" },
    { value: " ", type: "character" },
    { value: "homepage", type: "word" },
    { value: " ", type: "character" },
    { value: "is", type: "word" },
    { value: " ", type: "character" },
    { value: "https://github.com", type: "url" },
    { value: ".", type: "character" }
  ]
  */
  ```
- ```ts
  /* Either */
  Array.from(new StringDissector().dissect("🤝💑💏👪👨‍👩‍👧‍👦👩‍👦👩‍👧‍👦🧑‍🤝‍🧑")).map((element) => { return element.value; });
  Array.from(stringDissect("🤝💑💏👪👨‍👩‍👧‍👦👩‍👦👩‍👧‍👦🧑‍🤝‍🧑")).map((element) => { return element.value; });
  //=> [ "🤝", "💑", "💏", "👪", "👨‍👩‍👧‍👦", "👩‍👦", "👩‍👧‍👦", "🧑‍🤝‍🧑" ]
  ```
