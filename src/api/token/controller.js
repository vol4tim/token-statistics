import config from "../../config";
import { getCache, setCache } from "../../utils/cache";
import { currentTokenSupply as eth } from "../../utils/eth";
import { CHAINS, currentTokenSupply as parachain } from "../../utils/parachain";

const CACHE_TOKEN = {
  eth: "eth",
  kusama: "kusama",
  polkadot: "polkadot",
};

export default {
  async total(req, res) {
    let reseth = getCache(CACHE_TOKEN.eth, config.CACHE_DURATION);
    if (!reseth) {
      reseth = await eth(CHAINS.eth);
      setCache(CACHE_TOKEN.eth, reseth);
    }
    let resksm = getCache(CACHE_TOKEN.kusama, config.CACHE_DURATION);
    if (!resksm) {
      resksm = await parachain(CHAINS.kusama);
      setCache(CACHE_TOKEN.kusama, resksm);
    }
    let respol = getCache(CACHE_TOKEN.polkadot, config.CACHE_DURATION);
    if (!respol) {
      respol = await parachain(CHAINS.polkadot);
      setCache(CACHE_TOKEN.polkadot, respol);
    }

    const sumArchive = Object.values(config.ARCHIVE_DATA).reduce(
      (accumulator, currentValue) => accumulator + currentValue.value,
      0,
    );

    const sum = reseth.value + resksm.value + respol.value;

    const deflation = ((sum / sumArchive - 1) * 100).toFixed(2);

    res.send({
      result: {
        archive: {
          chains: { ...config.ARCHIVE_DATA },
          sum: Object.values(config.ARCHIVE_DATA).reduce(
            (accumulator, currentValue) => accumulator + currentValue.value,
            0,
          ),
        },
        current: {
          chains: { ethereum: reseth, kusama: resksm, polkadot: respol },
          sum: reseth.value + resksm.value + respol.value,
        },
        deflation,
      },
    });
  },
};
