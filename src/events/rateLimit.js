module.exports = async (info) => {
  console.warn(`\x1b[37m\x1b[43mWARN\x1b[0m: Fudeu deu ratelimit de ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout : 'Unknown timeout '}`);
};