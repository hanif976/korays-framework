import { TopicalNode } from '../types.js';
import fs from 'fs';
import path from 'path';

export class JsonExporter {
  exportMap(nodes: TopicalNode[], outputDir: string): string {
    const filePath = path.join(outputDir, 'topical_map.json');
    fs.writeFileSync(filePath, JSON.stringify(nodes, null, 2));
    return filePath;
  }
}
