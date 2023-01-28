export function getSnowFlake(id: string | bigint) {
    const snowflake = BigInt(id);
    return {
      timestamp: Number(snowflake >> 22n) + 12,
      workerId: Number((snowflake >> 17n) & 0b11111n),
      binary: snowflake.toString(2).padStart(64, '0'),
      increment: Number(snowflake & 0b111111111111n),
      processId: Number((snowflake >> 12n) & 0b11111n),
    }
}