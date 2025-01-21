import { ApiPromise, WsProvider } from "@polkadot/api";

export const CHAINS = {
  kusama: "kusama",
  polkadot: "polkadot",
};

export async function currentTokenSupply(chain = CHAINS.kusama) {
  try {
    const api = await ApiPromise.create({
      provider: new WsProvider(`wss://${chain}.rpc.robonomics.network/`),
    });
    const lastHeader = await api.rpc.chain.getHeader();
    const apiAt = await api.at(lastHeader.hash);
    const timestamp = await apiAt.query.timestamp.now();
    const result = await apiAt.query.balances.totalIssuance();
    await api.disconnect();
    return {
      block: lastHeader.number.toNumber(),
      timestamp: timestamp.toNumber(),
      value: result.toJSON(),
    };
  } catch (error) {
    console.log(JSON.stringify(error));
  }
  return false;
}
