module.exports = async(info) => {
    console.log(`[RATELIMIT] Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
}