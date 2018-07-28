import fs from 'fs';
import util from 'util';

const { promisify } = util;

export const mkdir = promisify(fs.mkdir);
