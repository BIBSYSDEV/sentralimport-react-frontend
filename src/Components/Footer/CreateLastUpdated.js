import preval from 'preval.macro';

export default function createLastUpdated() {
  let dateTimeStamp = preval`module.exports = new Date().toLocaleString('no', { timeZone: 'UTC' });`;
  return `Sist oppdatert: ${dateTimeStamp} (UTC)`;
}
