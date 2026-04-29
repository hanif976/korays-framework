import { TopicalNode } from '../types.js';
import fs from 'fs';
import path from 'path';

export class CsvExporter {
  exportMap(nodes: TopicalNode[], outputDir: string): string {
    const filePath = path.join(outputDir, 'topical_map.csv');
    const header = 'id,query,intent,pageType,tier\n';
    const rows = nodes.map(n => `${n.id},${n.query.query},${n.query.intent},${n.pageType},${n.tier}`).join('\n');
    fs.writeFileSync(filePath, header + rows);
    return filePath;
  }
}
