/** Contrat stats renvoyé par le worker une fois le job terminé (GET /status/:id, status: done). */
export interface IngestJobStats {
  total_nodes: number;
  total_edges: number;
  /** Alias de total_nodes — nombre de fichiers JS/TS analysés */
  total_files_parsed: number;
  total_lines_of_code: number;
  sample_edges?: Array<{
    source: string;
    target: string;
    relationship: string;
  }>;
}
