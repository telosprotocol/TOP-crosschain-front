import {
  addBSCNetwork,
  addEthNetwork,
} from '@/store/chainStore';
import { MobXProviderContext } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useContext, useRef, useState } from 'react';

import { useClickAway } from 'react-use';

const ethImgSrc = require('@/assets/images/home/eth.png');
// const topImgSrc = require('@/assets/images/home/top.png');
const bscCoinImgSrc = require('@/assets/images/exchange/bsc.png');
const hescCoinImgSrc = require('@/assets/images/exchange/heco.png');
const todownImgSrc = require('@/assets/images/exchange/todown.png');

function SelectChain() {
  const {
    chain: { netShortName, netId },
  } = useContext(MobXProviderContext);

  const [showSelect, setShowSelect] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    setShowSelect(false);
  });

  return (
    <div className="SelectChain" ref={ref}>
      <div
        className="SelectChain-line"
        onClick={() => setShowSelect(!showSelect)}
      >
        {netShortName === 'ETH' && (
          <img className="SelectChain-logo" src={ethImgSrc} />
        )}
        {netShortName === 'BSC' && (
          <img className="SelectChain-logo" src={bscCoinImgSrc} />
        )}
        {netShortName === 'HECO' && (
          <img className="SelectChain-logo" src={hescCoinImgSrc} />
        )}
        {netShortName} Mainnet
        <img className="SelectChain-todown" src={todownImgSrc} />
      </div>
      {showSelect && (
        <div className="SelectChain-list">
          <div
            onClick={() => addEthNetwork()}
            className={netShortName === 'ETH' ? 'SelectChain-selected' : ''}
          >
            <img className="SelectChain-logo" src={ethImgSrc} /> ETH Mainnet
          </div>
          <div
            onClick={() => addBSCNetwork()}
            className={netShortName === 'BSC' ? 'SelectChain-selected' : ''}
          >
            <img className="SelectChain-logo" src={bscCoinImgSrc} /> BSC Mainnet
          </div>
        </div>
      )}
    </div>
  );
}

export default observer(SelectChain);
