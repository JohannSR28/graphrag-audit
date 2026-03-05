export const FAKE_FILES = [
  "src/utils/parser.ts",
  "packages/react-reconciler/src/ReactFiber.js",
  "components/ui/Button.tsx",
  "lib/db/connection.py",
  "api/gateway/router.ts",
  "core/engine/analyzer.go",
  "tests/integration/auth.test.ts",
  "src/hooks/useMetrics.ts",
];

export const STEP_DURATIONS_MS = [1500, 2500, 2000, 1500] as const;
export const TOTAL_INGESTION_MS =
  STEP_DURATIONS_MS[0] + STEP_DURATIONS_MS[1] + STEP_DURATIONS_MS[2] + STEP_DURATIONS_MS[3];

export const STEP_LABELS = [
  "1_ Résolution Git Delta",
  "2_ Parsing AST (Tree-sitter)",
  "3_ Encodage pgvector",
  "4_ Topologie Graphe (Neo4j)",
] as const;
