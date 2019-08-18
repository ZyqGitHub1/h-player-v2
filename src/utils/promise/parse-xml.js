import util from 'util';
import { parseString } from 'xml2js';

const parseStringSync = util.promisify(parseString);

export function parseXML(string, options) {
  const encodeXml = string.replace(/&/g, '&amp;');
  const defaultOptions = {
    explicitArray: true,
  };
  const mergedOptions = Object.assign(defaultOptions, options);
  return parseStringSync(encodeXml, mergedOptions);
}
