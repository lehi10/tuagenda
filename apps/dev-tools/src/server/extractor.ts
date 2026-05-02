import { Project, Node, SyntaxKind, type SourceFile } from "ts-morph";

export interface ExtractedBlock {
  functionName: string;
  code: string;
  startLine: number; // always 1 (full file)
  targetLine: number; // 1-based highlighted line
  fnStartLine?: number; // 1-based start of enclosing function
  fnEndLine?: number; // 1-based end of enclosing function
}

let project: Project | null = null;

function getProject(tsConfigPath: string): Project {
  if (!project) {
    project = new Project({
      tsConfigFilePath: tsConfigPath,
      skipAddingFilesFromTsConfig: false,
    });
  }
  return project;
}

/** Find the tightest enclosing function/method/arrow at the given 1-based line */
function findEnclosingFunction(sf: SourceFile, targetLine: number) {
  const totalLines = sf.getFullText().split("\n").length;
  // Clamp to valid range to prevent "Bad line number" crash from ts compiler
  const safeLine = Math.min(Math.max(1, targetLine), totalLines);

  // Convert to 0-based character position at start of line
  const pos = sf.compilerNode.getPositionOfLineAndCharacter(safeLine - 1, 0);

  // Walk all function-like nodes and find the tightest one that contains targetLine
  const candidates = [
    ...sf.getDescendantsOfKind(SyntaxKind.FunctionDeclaration),
    ...sf.getDescendantsOfKind(SyntaxKind.MethodDeclaration),
    ...sf.getDescendantsOfKind(SyntaxKind.ArrowFunction),
    ...sf.getDescendantsOfKind(SyntaxKind.FunctionExpression),
  ].filter((fn) => fn.getStart() <= pos && fn.getEnd() >= pos);

  if (candidates.length === 0) return null;

  // Return the tightest (smallest range)
  return candidates.reduce((prev, curr) =>
    curr.getEnd() - curr.getStart() < prev.getEnd() - prev.getStart()
      ? curr
      : prev,
  );
}

/** Get the name of a function-like node */
function getFunctionName(node: Node): string {
  // MethodDeclaration / FunctionDeclaration — has getName()
  if (Node.isMethodDeclaration(node) || Node.isFunctionDeclaration(node)) {
    return node.getName() ?? "(anonymous)";
  }

  // ArrowFunction / FunctionExpression — look at parent for variable/property name
  const parent = node.getParent();

  if (parent && Node.isVariableDeclaration(parent)) {
    return parent.getName();
  }

  if (parent && Node.isPropertyAssignment(parent)) {
    return parent.getName();
  }

  return "(anonymous)";
}

export function extractBlock(
  absolutePath: string,
  targetLine: number,
  tsConfigPath: string,
): ExtractedBlock {
  const proj = getProject(tsConfigPath);
  let sf = proj.getSourceFile(absolutePath);
  if (!sf) sf = proj.addSourceFileAtPath(absolutePath);

  const totalLines = sf.getFullText().split("\n").length;
  const safeLine = Math.min(Math.max(1, targetLine), totalLines);

  const fn = findEnclosingFunction(sf, safeLine);
  const fullCode = sf.getFullText();
  const functionName = fn ? getFunctionName(fn) : "(file context)";

  return {
    functionName,
    code: fullCode,
    startLine: 1,
    targetLine: safeLine,
    fnStartLine: fn?.getStartLineNumber(),
    fnEndLine: fn?.getEndLineNumber(),
  };
}
