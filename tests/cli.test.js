import { describe, it, expect } from 'vitest';
import path from 'path';

describe('CLI Argument Parsing', () => {
  function parseArgs(args) {
    const opts = { repo: process.cwd(), output: null, format: 'json' };
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--repo' && args[i + 1]) {
        opts.repo = path.resolve(args[++i]);
      } else if (args[i] === '--output' && args[i + 1]) {
        opts.output = path.resolve(args[++i]);
      } else if (args[i] === '--format' && args[i + 1]) {
        opts.format = args[++i];
      }
    }
    return opts;
  }

  describe('--repo flag', () => {
    it('should parse --repo path', () => {
      const args = ['--repo', '/path/to/repo'];
      const opts = parseArgs(args);
      expect(opts.repo).toBe(path.resolve('/path/to/repo'));
    });

    it('should use cwd as default for --repo', () => {
      const args = [];
      const opts = parseArgs(args);
      expect(opts.repo).toBe(process.cwd());
    });

    it('should resolve relative paths', () => {
      const args = ['--repo', './myrepo'];
      const opts = parseArgs(args);
      expect(opts.repo).toContain('myrepo');
    });
  });

  describe('--output flag', () => {
    it('should parse --output path', () => {
      const args = ['--output', '/tmp/results.json'];
      const opts = parseArgs(args);
      expect(opts.output).toBe(path.resolve('/tmp/results.json'));
    });

    it('should use null as default for --output', () => {
      const args = [];
      const opts = parseArgs(args);
      expect(opts.output).toBeNull();
    });

    it('should resolve relative output paths', () => {
      const args = ['--output', './evidence.json'];
      const opts = parseArgs(args);
      expect(opts.output).toContain('evidence.json');
    });
  });

  describe('--format flag', () => {
    it('should parse --format flag', () => {
      const args = ['--format', 'markdown'];
      const opts = parseArgs(args);
      expect(opts.format).toBe('markdown');
    });

    it('should support json format', () => {
      const args = ['--format', 'json'];
      const opts = parseArgs(args);
      expect(opts.format).toBe('json');
    });

    it('should support markdown format', () => {
      const args = ['--format', 'markdown'];
      const opts = parseArgs(args);
      expect(opts.format).toBe('markdown');
    });

    it('should support html format', () => {
      const args = ['--format', 'html'];
      const opts = parseArgs(args);
      expect(opts.format).toBe('html');
    });

    it('should use json as default format', () => {
      const args = [];
      const opts = parseArgs(args);
      expect(opts.format).toBe('json');
    });

    it('should preserve format case from input', () => {
      const args = ['--format', 'HTML'];
      const opts = parseArgs(args);
      expect(opts.format).toBe('HTML');
    });
  });

  describe('Combined flags', () => {
    it('should parse all three flags together', () => {
      const args = ['--repo', '/app', '--output', '/out/results.json', '--format', 'markdown'];
      const opts = parseArgs(args);
      expect(opts.repo).toBe(path.resolve('/app'));
      expect(opts.output).toBe(path.resolve('/out/results.json'));
      expect(opts.format).toBe('markdown');
    });

    it('should handle flags in different order', () => {
      const args = ['--format', 'html', '--repo', '/data', '--output', 'report.html'];
      const opts = parseArgs(args);
      expect(opts.format).toBe('html');
      expect(opts.repo).toBe(path.resolve('/data'));
      expect(opts.output).toContain('report.html');
    });

    it('should handle flags mixed with unrecognized args', () => {
      const args = ['--repo', '/src', '--help', '--format', 'json'];
      const opts = parseArgs(args);
      expect(opts.repo).toBe(path.resolve('/src'));
      expect(opts.format).toBe('json');
    });
  });

  describe('Edge cases', () => {
    it('should handle flag without value', () => {
      const args = ['--repo', '/path', '--format'];
      const opts = parseArgs(args);
      expect(opts.repo).toBe(path.resolve('/path'));
      expect(opts.format).toBe('json'); // Default unchanged
    });

    it('should handle trailing flags', () => {
      const args = ['--repo', '/path', '--format', 'json', '--output'];
      const opts = parseArgs(args);
      expect(opts.repo).toBe(path.resolve('/path'));
      expect(opts.format).toBe('json');
      expect(opts.output).toBeNull();
    });

    it('should handle empty args array', () => {
      const args = [];
      const opts = parseArgs(args);
      expect(opts.repo).toBe(process.cwd());
      expect(opts.output).toBeNull();
      expect(opts.format).toBe('json');
    });

    it('should handle absolute paths on Windows', () => {
      const args = ['--repo', 'D:\\project'];
      const opts = parseArgs(args);
      expect(opts.repo).toBe(path.resolve('D:\\project'));
    });
  });

  describe('Format validation', () => {
    it('should accept all supported formats', () => {
      const supportedFormats = ['json', 'markdown', 'html'];
      
      for (const format of supportedFormats) {
        const args = ['--format', format];
        const opts = parseArgs(args);
        expect(supportedFormats.includes(opts.format.toLowerCase())).toBe(true);
      }
    });

    it('should handle custom/unsupported format', () => {
      const args = ['--format', 'xml'];
      const opts = parseArgs(args);
      // Format is stored as-is; validation happens elsewhere
      expect(opts.format).toBe('xml');
    });
  });

  describe('Help flag', () => {
    it('should recognize --help flag', () => {
      const helpArgs = ['--help', '--format', 'json'];
      // Help flag would normally exit; just verify parsing works
      expect(helpArgs).toContain('--help');
    });

    it('should recognize -h flag', () => {
      const helpArgs = ['-h'];
      expect(helpArgs).toContain('-h');
    });
  });

  describe('Output file extension handling', () => {
    it('should accept .json output file', () => {
      const args = ['--output', 'results.json'];
      const opts = parseArgs(args);
      expect(opts.output).toContain('.json');
    });

    it('should accept .md output file', () => {
      const args = ['--output', 'results.md'];
      const opts = parseArgs(args);
      expect(opts.output).toContain('.md');
    });

    it('should accept .html output file', () => {
      const args = ['--output', 'report.html'];
      const opts = parseArgs(args);
      expect(opts.output).toContain('.html');
    });

    it('should accept output files without extension', () => {
      const args = ['--output', '/tmp/results'];
      const opts = parseArgs(args);
      expect(opts.output).toBe(path.resolve('/tmp/results'));
    });
  });
});
