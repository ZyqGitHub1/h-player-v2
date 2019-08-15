import util from 'util';
import { parseString } from 'xml2js';

const parseStringSync = util.promisify(parseString);

export function parseXML(string, options) {
  const defaultOptions = {
    explicitArray: true,
  };
  const mergedOptions = Object.assign(defaultOptions, options);
  return parseStringSync(string, mergedOptions);
}
