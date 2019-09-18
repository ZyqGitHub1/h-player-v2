import { parseStringPromise } from 'xml2js';

export function parseXML(string, options) {
  const encodeXml = string.replace(/&/g, '&amp;');
  const defaultOptions = {
    explicitArray: true,
  };
  const mergedOptions = Object.assign(defaultOptions, options);
  return parseStringPromise(encodeXml, mergedOptions);
}
