import fs from "fs";
import { Project, SyntaxKind, type SourceFile } from "ts-morph";

export interface FileMetrics {
  path: string;
  lines: number;
  anyCount: number;
  asCount: number;
  tsIgnoreCount: number;
  consoleCount: number;
  todoCount: number;
  useEffectCount: number;
  importCount: number;
  fnCount: number;
  maxFnLines: number;
  avgFnLines: number;
}

// ── In-memory cache — persists across requests for the life of the dev server ─

interface CacheEntry {
  mtime: number;
  metrics: FileMetrics;
}

const cache = new Map<string, CacheEntry>();

// ── Per-file analysis ─────────────────────────────────────────────────────────

function analyzeSourceFile(sf: SourceFile, rel: string): FileMetrics {
  const text = sf.getFullText();

  // AST-based (accurate)
  const anyCount = sf.getDescendantsOfKind(SyntaxKind.AnyKeyword).length;
  const asCount = sf.getDescendantsOfKind(SyntaxKind.AsExpression).length;
  const importCount = sf.getImportDeclarations().length;

  const fnKinds = [
    SyntaxKind.FunctionDeclaration,
    SyntaxKind.ArrowFunction,
    SyntaxKind.MethodDeclaration,
    SyntaxKind.FunctionExpression,
  ] as const;

  const fnLengths: number[] = [];
  for (const kind of fnKinds) {
    for (const fn of sf.getDescendantsOfKind(kind)) {
      fnLengths.push(fn.getEndLineNumber() - fn.getStartLineNumber() + 1);
    }
  }

  const fnCount = fnLengths.length;
  const maxFnLines = fnCount > 0 ? Math.max(...fnLengths) : 0;
  const avgFnLines =
    fnCount > 0
      ? Math.round(fnLengths.reduce((a, b) => a + b, 0) / fnCount)
      : 0;

  // Regex-based (fast)
  const lines = text.split("\n").length;
  const tsIgnoreCount = (text.match(/@ts-ignore|@ts-nocheck/g) ?? []).length;
  const consoleCount = (
    text.match(/console\.(log|warn|error|info)\s*\(/g) ?? []
  ).length;
  const todoCount = (text.match(/\/\/\s*(TODO|FIXME|HACK)\b/gi) ?? []).length;
  const useEffectCount = (text.match(/useEffect\s*\(/g) ?? []).length;

  return {
    path: rel,
    lines,
    anyCount,
    asCount,
    tsIgnoreCount,
    consoleCount,
    todoCount,
    useEffectCount,
    importCount,
    fnCount,
    maxFnLines,
    avgFnLines,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function analyzeFiles(
  files: Array<{ rel: string; abs: string }>,
): FileMetrics[] {
  const toAnalyze: Array<{ rel: string; abs: string; mtime: number }> = [];
  const results: FileMetrics[] = [];

  // Split: cached vs needs analysis
  for (const file of files) {
    try {
      const mtime = fs.statSync(file.abs).mtimeMs;
      const hit = cache.get(file.abs);
      if (hit && hit.mtime === mtime) {
        results.push(hit.metrics);
      } else {
        toAnalyze.push({ ...file, mtime });
      }
    } catch {
      // file not accessible — skip
    }
  }

  if (toAnalyze.length === 0) return results;

  // Only parse files that aren't cached
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: { skipLibCheck: true, noResolve: true },
  });

  const added = new Map<string, { rel: string; mtime: number }>();
  for (const file of toAnalyze) {
    try {
      project.addSourceFileAtPath(file.abs);
      added.set(file.abs, { rel: file.rel, mtime: file.mtime });
    } catch {
      // skip unparseable files
    }
  }

  for (const sf of project.getSourceFiles()) {
    const abs = sf.getFilePath();
    const info = added.get(abs);
    if (!info) continue;

    const metrics = analyzeSourceFile(sf, info.rel);
    cache.set(abs, { mtime: info.mtime, metrics });
    results.push(metrics);
  }

  return results;
}

export function clearCache(): void {
  cache.clear();
}
