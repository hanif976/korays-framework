import fs from 'fs';
import path from 'path';
export class JsonExporter {
    exportMap(nodes, outputDir) {
        const filePath = path.join(outputDir, 'topical_map.json');
        fs.writeFileSync(filePath, JSON.stringify(nodes, null, 2));
        return filePath;
    }
}
