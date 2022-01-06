import preval from 'preval.macro';
import { version } from '../../../package.json';

export default function createLastUpdated() {
  let dateTimeStamp = preval`module.exports = new Date().toLocaleString('no', { timeZone: 'UTC' });`;
  return `Versjon: ${version} (Sist oppdatert: ${dateTimeStamp} (UTC))`;
}
