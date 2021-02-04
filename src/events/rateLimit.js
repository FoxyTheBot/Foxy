module.exports = async(info) => {
    console.warn(`\x1b[37m\x1b[43mWARN\x1b[0m: Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
}