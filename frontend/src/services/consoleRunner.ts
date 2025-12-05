import { Language } from '../data/blockDefinitions';

const API_BASE = 'http://localhost:8000'; // FastAPI backend

/**
 * Async console runner: Python goes through backend for real traceback,
 * other languages use local parsing.
 */
export async function runConsoleAsync(language: Language, sourceCode: string): Promise<string[]> {
  if (language === 'python') {
    return await runPythonConsole(sourceCode);
  }
  return runConsoleSync(language, sourceCode);
}

/**
 * Pure console runner that inspects source code and produces console output lines.
 * It does NOT actually execute code; it just parses for print/log-style calls
 * and does some very light syntax checks.
 */
export function runConsoleSync(language: Language, sourceCode: string): string[] {
  const output: string[] = ['▶ Running code...', '', '--- Output ---'];

  const code = sourceCode || '';

  let printed = false;

  const pushClean = (raw: string) => {
    const cleaned = raw
      .replace(/["'`]/g, '')
      .replace(/;$/, '')
      .trim();
    if (cleaned) {
      output.push(`> ${cleaned}`);
      printed = true;
    }
  };

  // JS / TS: basic syntax check via Function constructor
  if (language === 'javascript' || language === 'typescript') {
    try {
      // eslint-disable-next-line no-new-func
      new Function(code);
    } catch (err) {
      const error = err as Error;
      const lines: string[] = ['❌ Syntax error in your code', ''];
      lines.push(`Type: ${error.name || 'Error'}`);
      if (error.message) {
        lines.push(`Message: ${error.message}`);
      }
      if (error.stack) {
        lines.push('');
        lines.push('Traceback (most recent call last):');
        // Format JS stack similar to Python traceback
        error.stack
          .split('\n')
          .slice(1) // skip the first "Error: ..." line (already shown)
          .forEach((s) => {
            const trimmed = s.trim();
            if (trimmed.length > 0) lines.push(trimmed);
          });
      }
      return lines;
    }
  }

  // Extract outputs by language
  if (language === 'javascript' || language === 'typescript') {
    const regex = /console\.log\(([^)]*)\)/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(code)) !== null) {
      pushClean(match[1]);
    }
  } else if (language === 'python') {
    const regex = /print\(([^)]*)\)/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(code)) !== null) {
      pushClean(match[1]);
    }
  } else if (language === 'java') {
    const regex = /System\.out\.println\(([^)]*)\)/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(code)) !== null) {
      pushClean(match[1]);
    }
  } else if (language === 'c') {
    const regex = /printf\(([^)]*)\)/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(code)) !== null) {
      pushClean(match[1]);
    }
  } else if (language === 'cpp') {
    const regex = /std::cout\s*<<\s*([^;]+);/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(code)) !== null) {
      pushClean(match[1]);
    }
  } else if (language === 'ruby') {
    const regex = /(?:puts|print)\s+(.+)/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(code)) !== null) {
      pushClean(match[1]);
    }
  }

  // Fallback: echo code so console is never empty
  if (!printed) {
    const lines = code.split('\n');
    if (lines.length > 0) {
      lines.forEach((line) => {
        const cleanedLine = line.trim();
        if (cleanedLine.length > 0) {
          output.push(`> ${cleanedLine}`);
        }
      });
    } else {
      output.push('No output generated. Add a Print block or use print()/console.log().');
    }
  }

  return output;
}

// Use backend /execute/python to get real error info and format simply
async function runPythonConsole(code: string): Promise<string[]> {
  const out: string[] = [];

  try {
    const res = await fetch(`${API_BASE}/execute/python`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();

    // No error: show execution complete + printed output (stdout)
    if (data.ok) {
      out.push('✅ Execution complete!', '', '--- Output ---');
      const outputText = (data.output || '').toString();
      if (outputText.trim().length > 0) {
        outputText.split('\n').forEach((line: string) => {
          const cleaned = line.trimEnd();
          if (cleaned.length > 0) out.push(`> ${cleaned}`);
        });
      } else {
        out.push('> (no output)');
      }
      return out;
    }

    const err = data.error;
    out.push('❌ Python error');
    out.push('');

    // 1) Show the user's code with line numbers
    const lines = code.split('\n');
    out.push('Code:');
    lines.forEach((line, idx) => {
      const num = String(idx + 1).padStart(3, ' ');
      out.push(`${num}: ${line}`);
    });
    out.push('');

    // 2) Simple error summary
    out.push(`Type: ${err.type}`);
    if (err.msg) out.push(`Message: ${err.msg}`);
    if (err.line != null && err.col != null) {
      out.push(`Location: line ${err.line}, column ${err.col}`);
    }

    // Optional pointer for syntax errors
    if (err.kind === 'syntax' && err.text && err.col != null && err.col > 0) {
      out.push('');
      out.push(`> ${err.text.trimEnd()}`);
      out.push(' '.repeat(err.col) + '^');
    }

    return out;
  } catch (e) {
    out.push('❌ Failed to contact Python execution service');
    out.push(String(e));
    return out;
  }
}
