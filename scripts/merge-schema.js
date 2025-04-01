const fs = require("fs");
const path = require("path");

const schemaDir = path.join(__dirname, "../prisma/schema");
const outputFile = path.join(__dirname, "../prisma/schema.prisma");

// 정렬을 위한 우선순위 파일들
const PRIORITY_FILES = ["generator", "datasource"];

function getPriority(fileContent, filename) {
  if (filename.includes("generator")) return 0;
  if (filename.includes("datasource")) return 1;
  return 2;
}

function mergeSchemas() {
  const files = fs
    .readdirSync(schemaDir)
    .filter((file) => file.endsWith(".prisma"));

  const sortedFiles = files.sort((a, b) => {
    return getPriority(a, a) - getPriority(b, b);
  });

  let merged = "";

  sortedFiles.forEach((file) => {
    const content = fs.readFileSync(path.join(schemaDir, file), "utf8");
    merged += `// -------- ${file} --------\n`;
    merged += content + "\n\n";
  });

  fs.writeFileSync(outputFile, merged);
  console.log("✅ schema.prisma 파일 병합 완료!");
}

mergeSchemas();
