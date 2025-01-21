import axios from "axios";
import config from "../config";

const token = "0x7de91b204c1c737bcee6f000aaa6569cf7061cb7";

export async function currentTokenSupply() {
  const block = await axios.get(
    `https://api.etherscan.io/v2/api?chainid=1&module=proxy&action=eth_getBlockByNumber&boolean=false&apikey=${config.ETHERSCAN_API_KEY}`,
  );
  const res = await axios.get(
    `https://api.etherscan.io/v2/api?chainid=1&module=stats&action=tokensupply&contractaddress=${token}&apikey=${config.ETHERSCAN_API_KEY}`,
  );
  return {
    block: Number(block.data.result.number),
    timestamp: Number(block.data.result.timestamp) * 1000,
    value: Number(res.data.result),
  };
}
