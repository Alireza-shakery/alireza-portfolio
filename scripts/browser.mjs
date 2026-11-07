import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function browserOptions() {
  const candidates = [
    process.env.CHROME_PATH,
    ...(process.platform === 'win32'
      ? [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA]
          .filter(Boolean)
          .map((root) => join(root, 'Google', 'Chrome', 'Application', 'chrome.exe'))
      : []),
  ];
  const executablePath = candidates.find((candidate) => candidate && existsSync(candidate));
  return { headless: true, ...(executablePath ? { executablePath } : {}) };
}
