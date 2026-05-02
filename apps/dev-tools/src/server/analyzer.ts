import {
  Project,
  SyntaxKind,
  Node,
  type PropertyAccessExpression,
} from "ts-morph";
import path from "path";
import fs from "fs";

export interface GraphNode {
  id: string;
  label: string;
  file: string;
  line: number;
  layer: "router" | "procedure" | "usecase" | "port" | "repository" | "db";
  meta?: {
    procType?: "public" | "private" | "businessMember";
    opType?: "query" | "mutation";
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  variant?: "call" | "implements";
  callFile?: string; // file where this connection is made
  callLine?: number; // line where this connection is made
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  analyzedAt: string;
}

function toRelPath(absolutePath: string, root: string): string {
  if (absolutePath.startsWith(root)) {
    return absolutePath.replace(root, "").replace(/^\//, "");
  }
  // File is outside webAppRoot (e.g. a monorepo package) — keep absolute path
  return absolutePath;
}

export async function analyzeGraph(webAppRoot: string): Promise<GraphData> {
  const project = new Project({
    tsConfigFilePath: path.join(webAppRoot, "tsconfig.json"),
    skipAddingFilesFromTsConfig: false,
  });

  const nodesMap = new Map<string, GraphNode>();
  const edgesMap = new Map<string, GraphEdge>();

  // Load Prisma schema for DB node line resolution
  const schemaPath = path.resolve(
    webAppRoot,
    "../../packages/db/prisma/schema.prisma",
  );
  let schemaLines: string[] = [];
  try {
    schemaLines = fs.readFileSync(schemaPath, "utf-8").split("\n");
  } catch {
    // schema not found at expected path — DB nodes will show label only
  }

  const upsertNode = (n: GraphNode) => {
    if (!nodesMap.has(n.id)) nodesMap.set(n.id, n);
    return n.id;
  };
  const upsertEdge = (e: GraphEdge) => {
    if (!edgesMap.has(e.id)) edgesMap.set(e.id, e);
  };

  // 1. Find all sub-router files
  const routerFiles = project
    .getSourceFiles()
    .filter(
      (sf) =>
        sf.getFilePath().includes("/trpc/routers/") &&
        sf.getBaseName().endsWith(".router.ts") &&
        !sf.getBaseName().startsWith("app."),
    );

  for (const routerFile of routerFiles) {
    const routerName = routerFile.getBaseName().replace(".router.ts", "");
    const routerId = `router:${routerName}`;

    upsertNode({
      id: routerId,
      label: `${routerName}Router`,
      file: toRelPath(routerFile.getFilePath(), webAppRoot),
      line: 1,
      layer: "router",
    });

    // 2. Find router({...}) object properties = procedures
    const routerObjs = routerFile
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter((call) => call.getExpression().getText() === "router")
      .map((call) => call.getArguments()[0])
      .filter(Node.isObjectLiteralExpression);

    for (const obj of routerObjs) {
      for (const prop of obj.getProperties()) {
        if (!Node.isPropertyAssignment(prop)) continue;

        const procName = prop.getName();
        const initText = prop.getInitializer()?.getText() ?? "";

        let procType: "public" | "private" | "businessMember" = "public";
        if (initText.startsWith("businessMemberProcedure"))
          procType = "businessMember";
        else if (initText.startsWith("privateProcedure")) procType = "private";

        const opType: "query" | "mutation" = initText.includes(".mutation(")
          ? "mutation"
          : "query";

        const procId = `proc:${routerName}.${procName}`;

        upsertNode({
          id: procId,
          label: procName,
          file: toRelPath(routerFile.getFilePath(), webAppRoot),
          line: prop.getStartLineNumber(),
          layer: "procedure",
          meta: { procType, opType },
        });

        upsertEdge({
          id: `${routerId}→${procId}`,
          source: routerId,
          target: procId,
          callFile: toRelPath(routerFile.getFilePath(), webAppRoot),
          callLine: prop.getStartLineNumber(),
        });

        // 3. Find new XxxUseCase() inside the procedure
        for (const newExpr of prop.getDescendantsOfKind(
          SyntaxKind.NewExpression,
        )) {
          const className = newExpr.getExpression().getText();
          if (!className.endsWith("UseCase")) continue;

          // Search all source files for the class (handles barrel re-exports)
          const ucFile = project
            .getSourceFiles()
            .find((sf) =>
              sf.getClasses().some((cls) => cls.getName() === className),
            );

          if (!ucFile) continue;

          const ucId = `uc:${className}`;

          // Use the execute() method line in the use case file, not the `new` line in the router
          const executeMethod = ucFile.getClasses()[0]?.getMethod("execute");
          const ucLine =
            executeMethod?.getStartLineNumber() ??
            ucFile.getClasses()[0]?.getStartLineNumber() ??
            1;

          upsertNode({
            id: ucId,
            label: className.replace("UseCase", ""),
            file: toRelPath(ucFile.getFilePath(), webAppRoot),
            line: ucLine,
            layer: "usecase",
          });

          upsertEdge({
            id: `${procId}→${ucId}`,
            source: procId,
            target: ucId,
            variant: "call",
            callFile: toRelPath(routerFile.getFilePath(), webAppRoot),
            callLine: newExpr.getStartLineNumber(),
          });

          // 4. Find repository params in the use case constructor
          for (const ucClass of ucFile.getClasses()) {
            for (const param of ucClass.getConstructors()[0]?.getParameters() ??
              []) {
              const portTypeName = param.getTypeNode()?.getText();
              if (!portTypeName) continue;

              // Match by param name OR type name containing "repo"/"repository"
              const paramName = param.getName().toLowerCase();
              const typeLower = portTypeName.toLowerCase();
              const isRepo =
                paramName.includes("repo") || typeLower.includes("repo");
              if (!isRepo) continue;

              const portId = `port:${portTypeName}`;
              const portFile = ucFile
                .getImportDeclarations()
                .find((imp) =>
                  imp
                    .getNamedImports()
                    .some((n) => n.getName() === portTypeName),
                )
                ?.getModuleSpecifierSourceFile();

              upsertNode({
                id: portId,
                label: portTypeName,
                file: portFile
                  ? toRelPath(portFile.getFilePath(), webAppRoot)
                  : "domain/repositories/",
                line: portFile
                  ? (portFile
                      .getInterfaces()
                      .find((i) => i.getName() === portTypeName)
                      ?.getStartLineNumber() ?? 1)
                  : 0,
                layer: "port",
              });

              upsertEdge({
                id: `${ucId}→${portId}`,
                source: ucId,
                target: portId,
                variant: "call",
                callFile: toRelPath(ucFile.getFilePath(), webAppRoot),
                callLine: param.getStartLineNumber(),
              });

              // 5. Find Prisma repository that implements this port
              for (const repoFile of project
                .getSourceFiles()
                .filter((sf) =>
                  sf.getFilePath().includes("/infrastructure/repositories/"),
                )) {
                for (const repoClass of repoFile
                  .getClasses()
                  .filter((cls) =>
                    cls
                      .getImplements()
                      .some(
                        (impl) =>
                          impl.getExpression().getText() === portTypeName,
                      ),
                  )) {
                  const repoId = `repo:${repoClass.getName()}`;

                  upsertNode({
                    id: repoId,
                    label: repoClass.getName() ?? "Repository",
                    file: toRelPath(repoFile.getFilePath(), webAppRoot),
                    line: repoClass.getStartLineNumber(),
                    layer: "repository",
                  });

                  upsertEdge({
                    id: `${portId}→${repoId}`,
                    source: portId,
                    target: repoId,
                    label: "implements",
                    variant: "implements",
                    callFile: toRelPath(repoFile.getFilePath(), webAppRoot),
                    callLine: repoClass.getStartLineNumber(),
                  });

                  // 6. Find prisma.model.method() → DB tables
                  const tables = new Set<string>();
                  for (const call of repoFile.getDescendantsOfKind(
                    SyntaxKind.CallExpression,
                  )) {
                    const expr = call.getExpression();
                    if (!Node.isPropertyAccessExpression(expr)) continue;
                    const modelExpr = expr.getExpression();
                    if (!Node.isPropertyAccessExpression(modelExpr)) continue;
                    if (modelExpr.getExpression().getText() !== "prisma")
                      continue;
                    tables.add(
                      (modelExpr as PropertyAccessExpression).getName(),
                    );
                  }

                  for (const table of tables) {
                    const dbId = `db:${table}`;
                    // Find the model definition line in schema.prisma
                    const modelLineIdx = schemaLines.findIndex((l) => {
                      const m = l.match(/^model\s+(\w+)/);
                      return (
                        m != null && m[1].toLowerCase() === table.toLowerCase()
                      );
                    });
                    upsertNode({
                      id: dbId,
                      label: table,
                      file: modelLineIdx >= 0 ? schemaPath : "",
                      line: modelLineIdx >= 0 ? modelLineIdx + 1 : 0,
                      layer: "db",
                    });
                    upsertEdge({
                      id: `${repoId}→${dbId}`,
                      source: repoId,
                      target: dbId,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges: Array.from(edgesMap.values()),
    analyzedAt: new Date().toISOString(),
  };
}
