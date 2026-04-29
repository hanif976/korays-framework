import { Command } from 'commander';
import { loadConfig } from './core/config.js';
import { GeminiClient } from './core/geminiClient.js';
import { MockSerpCollector } from './collectors/mockSerpCollector.js';
import { Orchestrator } from './orchestrator.js';
import dotenv from 'dotenv';
dotenv.config();
const program = new Command();
program
    .name('korays')
    .description('Topical Authority Operating System')
    .version('1.0.0');
program
    .command('map')
    .description('Run full topical map pipeline')
    .option('--seeds <seeds...>', 'Seed keywords')
    .action(async (options) => {
    const config = loadConfig();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY not found in environment');
        process.exit(1);
    }
    const aiClient = new GeminiClient(apiKey);
    const serpCollector = new MockSerpCollector(); // Use Mock for now
    const orchestrator = new Orchestrator(config, aiClient, serpCollector);
    await orchestrator.run(options.seeds);
});
program.parse();
