const urls = [
    "nexus-db-shard-00-00.1llff.mongodb.net",
    "nexus-db-shard-00-01.1llff.mongodb.net",
    "nexus-db-shard-00-02.1llff.mongodb.net"
];

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const chalk = require('chalk');
const os = require('os');

// Function to extract latency from ping output
function extractLatency(output) {
    const lines = output.split('\n');
    const latencyLines = lines.filter(line => line.includes('time='));
    
    return latencyLines.map(line => {
        const match = line.match(/time=(\d+ms)/);
        return match ? match[1] : null;
    }).filter(latency => latency != null);
}

const ping = async (host, shardNumber) => {
    let cmd = '';

    if (os.platform() === 'win32') {
        cmd = `ping -n 1 ${host}`;
    } else {
        cmd = `ping -c 1 ${host}`;
    }

    try {
        const { stdout } = await exec(cmd);
        const latencies = extractLatency(stdout);
        console.log(chalk.green(`Latency for shard ${shardNumber}:`), chalk.magenta(latencies.join(', ')));
    } catch (error) {
        console.error(chalk.red('Error:', error));
    }
};

urls.forEach((u, index) => {
    const shardNumber = index + 1;
    console.log(chalk.cyan(`Testing MongoDB Shard ${shardNumber}...`));
    ping(u, shardNumber);
});
