import { Loading } from '@/components';
import { MobXProviderContext } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';

function TxLoadingDialog() {
  const {
    chain: {
      currentTx: { from, to, coinType, amount, type },
    },
  } = useContext(MobXProviderContext);

  if (!from) {
    return null;
  }
  return (
    <div className="tld">
      <div className="tld-t1">
        {from} {'->'} {to}
      </div>
      <div className="tld-t2">
        {amount} {coinType}
      </div>
      <div className="tld-t2">{type}</div>
      <div className="tld-btns">
        <Loading /> <span>Fetching Status</span>
      </div>
    </div>
  );
}
export default observer(TxLoadingDialog);
