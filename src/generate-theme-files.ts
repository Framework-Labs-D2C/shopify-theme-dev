import chalk from "chalk";
import fs from "fs";
import path from "path";
import { sectionToLiquid_WithLocalization } from "./section-to-liquid-with-localization";
import { toKebabCase } from "./../utils/to-kebab-case";
import { toSnakeCase } from "./../utils/to-snake-case";
import { writeCompareFile } from "./generate-sections";
import { getAllFiles, getSectionSchemas, getSourcePaths } from "./index";

export const generateThemeFiles = (folder, sectionsSchemas, sectionLocaleCount) => {
  const { snippets, layouts, sections } = getSourcePaths();
  const translations: any = {};

  for (const key in sectionsSchemas) {
    const section = sectionsSchemas[key];
    const sectionName = `${toKebabCase(key)}.liquid`;
    const sectionPath = path.join(process.cwd(), folder, "sections", sectionName);

    const translationArray = [];
    if (process.env.SHOPIFY_SECTIONS_BEFORE_RENDER) {
      translationArray.push(process.env.SHOPIFY_SECTIONS_BEFORE_RENDER);
    }

    const rawContent = fs.readFileSync(
      path.join(process.cwd(), "sections", toKebabCase(key), `${toKebabCase(key)}.liquid`),
      {
        encoding: "utf-8",
      }
    );

    if (rawContent) {
      const translatedContent = rawContent.replace(
        /<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi,
        (str, group1, group2) => {
          const group = toSnakeCase(sectionPath.split(/[\\/]/gi).at(-1).split(".").at(0)).trim();
          const content = toSnakeCase(group2?.split(" ")?.slice(0, 2)?.join("_") ?? "").trim();
          const backupContent = toSnakeCase(group2).trim();
          const id = toSnakeCase(group1?.replace(/id="(.*)"/gi, "$1") ?? "").trim();

          if (!(group in translations)) {
            translations[group] = {};
          }

          if (id && !(id in translations[group])) {
            translations[group][id] = group2;
            return `{{ "${group}.${id}" | t }}`;
          }

          if (!(content in translations[group])) {
            translations[group][content] = group2;
            return `{{ "${group}.${content}" | t }}`;
          }

          if (translations[group][content] !== group2) {
            if (!(backupContent in translations[group])) {
              translations[group][backupContent] = group2;
              return `{{ "${group}.${backupContent}" | t }}`;
            }
            if (translations[group][backupContent] !== group2) {
              translations[group][`${content}_2`] = group2;
              return `{{ "${group}.${content}_2" | t }}`;
            }
          }

          if (translations[group][content] === group2) {
            return `{{ "${group}.${content}" | t }}`;
          }

          return group2;
        }
      );
      translationArray.push(translatedContent);
    }
    if (process.env.SHOPIFY_SECTIONS_AFTER_RENDER) {
      translationArray.push(process.env.SHOPIFY_SECTIONS_AFTER_RENDER);
    }
    translationArray.push(sectionToLiquid_WithLocalization(section, key, sectionLocaleCount));
    writeCompareFile(sectionPath, translationArray.join("\n"));
  }

  for (let i = 0; i < snippets.length; i++) {
    const snippet = snippets[i];
    const snippetName = snippet.split(/[\\/]/gi).at(-1);

    const snippetPath = path.join(process.cwd(), folder, "snippets", snippetName);

    const returnArr = [];

    const rawContent = fs.readFileSync(snippet, {
      encoding: "utf-8",
    });

    if (rawContent) {
      const translatedContent = rawContent.replace(
        /<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi,
        (str, group1, group2) => {
          const group = toSnakeCase(snippet.split(/[\\/]/gi).at(-1).split(".").at(0)).trim();
          const content = toSnakeCase(group2?.split(" ")?.slice(0, 2)?.join("_") ?? "").trim();
          const backupContent = toSnakeCase(group2).trim();
          const id = toSnakeCase(group1?.replace(/id="(.*)"/gi, "$1") ?? "").trim();

          if (!(group in translations)) {
            translations[group] = {};
          }

          if (id && !(id in translations[group])) {
            translations[group][id] = group2;
            return `{{ "${group}.${id}" | t }}`;
          }

          if (!(content in translations[group])) {
            translations[group][content] = group2;
            return `{{ "${group}.${content}" | t }}`;
          }

          if (translations[group][content] !== group2) {
            if (!(backupContent in translations[group])) {
              translations[group][backupContent] = group2;
              return `{{ "${group}.${backupContent}" | t }}`;
            }
            if (translations[group][backupContent] !== group2) {
              translations[group][`${content}_2`] = group2;
              return `{{ "${group}.${content}_2" | t }}`;
            }
          }
          if (translations[group][content] === group2) {
            return `{{ "${group}.${content}" | t }}`;
          }

          return group2;
        }
      );
      returnArr.push(translatedContent);
    }

    writeCompareFile(snippetPath, returnArr.join("\n"));
  }

  for (let i = 0; i < layouts.length; i++) {
    const layout = layouts[i];
    const layoutName = layout.split(/[\\/]/gi).at(-1);
    const layoutPath = path.join(process.cwd(), folder, "layout", layoutName);

    const returnArr = [];

    const rawContent = fs.readFileSync(layout, {
      encoding: "utf-8",
    });

    if (rawContent) {
      const translatedContent = rawContent.replace(
        /<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi,
        (str, group1, group2) => {
          const group = toSnakeCase(layout.split(/[\\/]/gi).at(-1).split(".").at(0)).trim();
          const content = toSnakeCase(group2?.split(" ")?.slice(0, 2)?.join("_") ?? "").trim();
          const backupContent = toSnakeCase(group2).trim();
          const id = toSnakeCase(group1?.replace(/id="(.*)"/gi, "$1") ?? "").trim();

          if (!(group in translations)) {
            translations[group] = {};
          }

          if (id && !(id in translations[group])) {
            translations[group][id] = group2;
            return `{{ "${group}.${id}" | t }}`;
          }

          if (!(content in translations[group])) {
            translations[group][content] = group2;
            return `{{ "${group}.${content}" | t }}`;
          }

          if (translations[group][content] !== group2) {
            if (!(backupContent in translations[group])) {
              translations[group][backupContent] = group2;
              return `{{ "${group}.${backupContent}" | t }}`;
            }
            if (translations[group][backupContent] !== group2) {
              translations[group][`${content}_2`] = group2;
              return `{{ "${group}.${content}_2" | t }}`;
            }
          }
          if (translations[group][content] === group2) {
            return `{{ "${group}.${content}" | t }}`;
          }

          return group2;
        }
      );
      returnArr.push(translatedContent);
    }

    writeCompareFile(layoutPath, returnArr.join("\n"));
  }

  let localesFile = "en.default.json";
  if (process.env.SHOPIFY_CMS_LOCALES) {
    localesFile = process.env.SHOPIFY_CMS_LOCALES;
  }
  const translationsPath = path.join(process.cwd(), folder, "locales", localesFile);
  const translationJsPath = path.join(process.cwd(), folder, "snippets", "_translations.liquid");
  const translationTypesPath = path.join(process.cwd(), "@types", "translations.ts");

  function isObject(x: any): x is Object {
    return x !== null && typeof x === "object" && !Array.isArray(x);
  }
  const transformTranslations = (input, prevKey = "") => {
    if (isObject(input)) {
      return Object.entries(input).reduce<any>(
        (acc, [key, val]) => {
          acc[key] = transformTranslations(val, `${prevKey ? `${prevKey}.` : ""}${key}`);
          return acc;
        },
        {}
      );
    }
    if (typeof input === "string") {
      return `{{ '${prevKey}' | t }}`;
    }
  };
  const translationsJs = `<script>
  window.theme_content = ${JSON.stringify(transformTranslations(translations), undefined, 2)};
</script>
  `;

  const translationTypes = `export type Translations = ${JSON.stringify(translations, undefined, 2)
    .replace(/(\s+)([^\n:]*):([^\n{]*?),?\n/gi, "$1/* $3 */\n$1$2: string;\n")
    .replace(/"/gi, "")
    .replace(/,/gi, ";")
    .replace(/}\n/gi, "};\n")
    .replace(/\n\n/gi, "\n")};
declare global {
  interface Window {
    theme_content?: Translations;
  }
}
`;

  writeCompareFile(translationsPath, JSON.stringify(translations, undefined, 2));
  writeCompareFile(translationJsPath, translationsJs);
  writeCompareFile(translationTypesPath, translationTypes);

  const target = getAllFiles(folder);

  if (process.env.SHOPIFY_CMS_DELETE) {
    for (let i = 0; i < target.length; i++) {
      if (/snippets[\\/][^\\/]*\.liquid$/gi.test(target[i])) {
        const fileName = target[i].split(/[\\/]/gi).at(-1);
        const targetFile = snippets.find((sourcePath) =>
          sourcePath.split(/[\\/]/gi).at(-1).includes(fileName)
        );
        if (!targetFile) {
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(
              `Deleted: ${target[i]}`
            )}`
          );
          fs.unlinkSync(path.join(process.cwd(), target[i]));
        }
      }

      if (/sections[\\/][^\\/]*\.liquid$/gi.test(target[i])) {
        const fileName = target[i].split(/[\\/]/gi).at(-1);
        const targetFile = sections.find((sourcePath) =>
          sourcePath.split(/[\\/]/gi).at(-1).includes(fileName)
        );
        if (!targetFile) {
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(
              `Deleted: ${target[i]}`
            )}`
          );
          fs.unlinkSync(path.join(process.cwd(), target[i]));
        }
      }

      if (/layout[\\/][^\\/]*\.liquid$/gi.test(target[i])) {
        const fileName = target[i].split(/[\\/]/gi).at(-1);
        const targetFile = layouts.find((sourcePath) =>
          sourcePath.split(/[\\/]/gi).at(-1).includes(fileName)
        );
        if (!targetFile) {
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(
              `Deleted: ${target[i]}`
            )}`
          );
          fs.unlinkSync(path.join(process.cwd(), target[i]));
        }
      }
    }
  }
};
