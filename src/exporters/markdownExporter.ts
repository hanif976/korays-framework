import { TopicalNode } from '../types.js';
import fs from 'fs';
import path from 'path';

export class MarkdownExporter {
  exportBrief(node: TopicalNode, outputDir: string): string {
    if (!node.brief) throw new Error(`Node ${node.id} has no brief`);

    const brief = node.brief;
    const content = `# Content Brief: ${brief.targetKeyword}

## 1. Page Strategy
- Target Keyword: ${brief.targetKeyword}
- Secondary Keywords: ${brief.secondaryKeywords.join(', ')}
- Search Intent: ${brief.searchIntent}
- Page Type: ${brief.pageType}
- Funnel Stage: ${brief.funnelStage}
- Central Entity: ${brief.centralEntity}
- URL Slug: ${brief.urlSlug}

## 2. Metadata
- Meta Title: ${brief.metaTitle}
- Meta Description: ${brief.metaDescription}
- H1: ${brief.h1}

## 3. Required Entities
| Entity | Type |
|---|---|
${brief.requiredEntities.map(e => `| ${e.name} | ${e.type} |`).join('\n')}

## 4. Outline
${brief.outline.map(s => `### ${s.headingLevel}: ${s.heading}\nPurpose: ${s.purpose}`).join('\n\n')}

## 5. QA Checklist
${brief.qualityChecklist.map(c => `- [ ] ${c.name}`).join('\n')}
`;

    const filePath = path.join(outputDir, `${brief.urlSlug}.md`);
    fs.writeFileSync(filePath, content);
    return filePath;
  }
}
