import { GameLanguage, TestResult } from '../types/games';

/**
 * Execute code and run tests
 * This is a simulated execution since we can't run actual code in the browser
 */
export async function executeCode(
    language: GameLanguage,
    code: string,
    levelId: string
): Promise<TestResult> {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For HTML/CSS, we can render in an iframe
    if (language === 'html' || language === 'css') {
        return validateHTMLCSS(code, language, levelId);
    }

    // For programming languages, simulate test execution
    return simulateTests(language, code, levelId);
}

/**
 * Validate HTML/CSS code
 */
function validateHTMLCSS(code: string, language: GameLanguage, levelId: string): TestResult {
    const output: string[] = [];
    const details: string[] = [];

    if (language === 'html') {
        // Basic HTML validation
        if (!code.includes('<!DOCTYPE html>')) {
            details.push('❌ Missing DOCTYPE declaration');
        } else {
            details.push('✅ DOCTYPE declaration found');
        }

        if (!code.includes('<html>')) {
            details.push('❌ Missing <html> tag');
        } else {
            details.push('✅ HTML tag found');
        }

        if (!code.includes('<body>')) {
            details.push('❌ Missing <body> tag');
        } else {
            details.push('✅ Body tag found');
        }

        // Level-specific checks
        if (levelId === 'level1') {
            if (code.includes('<h1>') && code.toLowerCase().includes('welcome')) {
                details.push('✅ Welcome heading found');
            } else {
                details.push('❌ Missing welcome heading');
            }
        }
    }

    if (language === 'css') {
        // Basic CSS validation
        if (code.includes('{') && code.includes('}')) {
            details.push('✅ CSS syntax looks valid');
        } else {
            details.push('❌ Invalid CSS syntax');
        }

        if (levelId === 'level1') {
            if (code.includes('color:') || code.includes('color :')) {
                details.push('✅ Color property found');
            } else {
                details.push('❌ Missing color property');
            }
        }
    }

    const passed = !details.some(d => d.startsWith('❌'));

    return {
        passed,
        message: passed ? '✅ All tests passed!' : '❌ Some tests failed',
        details,
        output,
    };
}

/**
 * Simulate test execution for programming languages
 */
function simulateTests(language: GameLanguage, code: string, levelId: string): TestResult {
    const output: string[] = [];
    const details: string[] = [];

    // Extract print/output statements
    if (language === 'python') {
        const printMatches = code.matchAll(/print\s*\((.*?)\)/g);
        for (const match of printMatches) {
            output.push(match[1].replace(/['"]/g, ''));
        }

        // Basic syntax checks
        if (code.includes('def ')) {
            details.push('✅ Function definition found');
        }

        if (levelId === 'level1') {
            if (code.includes('=')) {
                details.push('✅ Variable assignment found');
            } else {
                details.push('❌ No variable assignment found');
            }
        }
    }

    if (language === 'ruby') {
        const putsMatches = code.matchAll(/puts\s+(.*?)$/gm);
        for (const match of putsMatches) {
            output.push(match[1].replace(/['"]/g, ''));
        }

        if (code.includes('def ')) {
            details.push('✅ Method definition found');
        }

        if (levelId === 'level1') {
            if (code.includes('=')) {
                details.push('✅ Variable assignment found');
            } else {
                details.push('❌ No variable assignment found');
            }
        }
    }

    if (language === 'javascript') {
        const consoleMatches = code.matchAll(/console\.log\s*\((.*?)\)/g);
        for (const match of consoleMatches) {
            output.push(match[1].replace(/['"]/g, ''));
        }

        if (code.includes('function ') || code.includes('=>')) {
            details.push('✅ Function found');
        }
    }

    // Determine if tests passed
    const passed = details.length > 0 && !details.some(d => d.startsWith('❌'));

    return {
        passed,
        message: passed
            ? '✅ Great job! All tests passed!'
            : '⚠️ Code executed, but some checks failed. Keep trying!',
        details: details.length > 0 ? details : ['✅ Code syntax looks good!'],
        output: output.length > 0 ? output : ['(No output)'],
    };
}

/**
 * Render HTML/CSS in an iframe
 */
export function renderHTMLPreview(html: string, css: string = ''): string {
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        ${css}
    </style>
</head>
<body>
    ${html.includes('<body>') ? html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] || html : html}
</body>
</html>
    `.trim();

    return fullHTML;
}
