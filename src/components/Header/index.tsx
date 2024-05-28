import React, { useState, useContext, useCallback, useMemo } from 'react';
import { MobXProviderContext, observer } from 'mobx-react';
import FormatMessage from '@/locale/FormatMessage';
import { Toast, Layout, Dialog } from '@/components';
import { useHistory } from 'react-router-dom';
import { formatBalance, formatAddress } from '@/utils';
import './index.less';
import SelectChain from './SelectChain';
import CrossChainSelect from './CrossChainSelect';

const content = require('@/assets/images/home/address.png');
const logo = require('@/assets/images/home/logo.png');
const logoM = require('@/assets/images/home/logo-m.png');
const eth = require('@/assets/images/home/eth.png');
const top = require('@/assets/images/home/top.png');
const link = require('@/assets/images/link.png');
const copy = require('@/assets/images/copy.png');

export const ethscan =
  process.env.NODE_ENV === 'development'
    ? 'https://rinkeby.etherscan.io/address/'
    : 'https://etherscan.com/address/';

const Header: React.FunctionComponent = () => {
  const {
    locale: { currentLanName, toogleLan, lan, getLocaleMessage },
    chain: { balance, address, enable, account, topAddr },
  } = useContext(MobXProviderContext);

  const [visible, setVisible] = useState(false);
  const handleClose = () => setVisible(false);
  const handleClick = () => setVisible(true);

  const [showMenu, setShowMenu] = useState(false);

  const history = useHistory();
  const toogleLanguage = useCallback(() => {
    const _lan = lan === 'CN' ? 'EN' : 'CN';
    toogleLan(_lan);
  }, [lan]);

  const TopAddr = useMemo(() => {
    return formatAddress(topAddr);
  }, [topAddr]);

  const handleCopy = addr => {
    if (
      document.queryCommandSupported &&
      document.queryCommandSupported('copy')
    ) {
      const textarea = document.createElement('textarea');
      textarea.textContent = addr;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        Toast.success(getLocaleMessage('toast.copy'));
      } catch (ex) {
        console.warn('Copy to clipboard failed.', ex);
      } finally {
        document.body.removeChild(textarea);
      }
      handleClose();
    }
  };

  const linkAddress = ethscan + account;
  const topLink =
    'https://www.topscan.io/accounts/accountsDetail?id=' + account;
  return (
    <div className={'top-nav'}>
      <div className="top-nav-wrappermobile">
        <div>
          {history.location.pathname === '/browser' && (
            <a href="/">
              <img className="nav-logo" src={logo} alt="logo" />
            </a>
          )}
          {history.location.pathname === '/integratedCrossChain' && (
            <div className="nav-right" onClick={() => setShowMenu(false)}>
              <CrossChainSelect />
            </div>
          )}
          {history.location.pathname === '/' && (
            <div className="nav-right" onClick={() => setShowMenu(false)}>
              <SelectChain />

              <div className="top-address">
                {address ? (
                  <span onClick={handleClick}>{address}</span>
                ) : (
                  <span onClick={enable}>
                    <FormatMessage id="content" />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {!showMenu && (
          <img
            onClick={() => setShowMenu(true)}
            className="nav-expand"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAA3klEQVRoQ+2awQ3DMAwD48nazbpZ0c0UOANUsn4UL28KIHlC4BhZl9mzzPJeBJ5OHMIQHtbAiojPsEx/4+zAQeDBDUB4MNwnGoQhPKyBvdJWx0ursM9La9jGpnEInFYkLoCwOMDUPoTTisQFEBYHmNqHcFqRuMCPcES8xKEd2efG46guQTGEBaEdWYbwUV2CYkvCb0FQbct+J612VaKDEBYFV7YN4XJVokIIi4Ir24ZwuSpRIYRFwZVtQ7hclahwfw9/Rb23bFteAPA3bWtXRIZYaRFQbZuWhH/tugQHbxTcZFhbmCfNAAAAAElFTkSuQmCC"
          />
        )}
        {showMenu && (
          <img
            onClick={() => setShowMenu(false)}
            className="nav-expand"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAACZElEQVRoQ+3bbZLCIAwGYHJHdc+4undkJxW6LQUb4A0NM9ufisjTpHyJ5DKX9/7pnHsS0U/ufeuvee/vzrkbEX2lbaX0hYDlD/B1nw0dsBwwvjhoO/QOnGDjvZgG7b2/OedeSRB36BVcwE6DLmBj+1f0Aj7BmkefYHdoEmLNooXYP3TykEs6YDPPdCWWbY+Y0twrx55tCnQTlui17bSmQTdg16xMhyXz6B4sp25u4mEW3YvNgsMwZQ6NwBbB1tAo7EewFTQSewq+Go3GisBXoTWwYvBotBa2CjwKrYmtBmujtbFNYC30CGwzGI0ehe0Co9Ajsd3gXvRoLATcig6L7nTD7dNaHLLxcFgtSVb/uTINOyc1XwXBwiIcW66EhmHh4Mb0Vk/j7RfAUnpbKSjS0MjG9qmAAZFWwaqkNCDSath/cM04cVa28zlWi7LKM9yJjfdSBQ0Hg7BqaCgYjFVBw8BKWDgaAm7APoJk+A943eAWLBEtq6SGz3Z3ZF3ghgY/IrZjwdGFbgYjsFegm8BI7Gh0NThgv3M/tRZmX4c0Ls3SKm+kX44wVB6eqwJrYhsjXY0Wg0dgR6BF4LC7yGOmqHxItZoNukOWa6X3KeAKrGakP4KvxGqhi2ALWA10FmwJi0bnji3xEdyhHdTZ7gkSnR5MM4tFobdHD81jEeh4uHQabC+az0tPh+1Ce+95RsRoySVeCEgqQ5SpnJG9jw8L0eawlZF+EdH7gLgAbRYrRC9YLpsOSzz+xv8sxbrMY0/QK/YADpHeoqfBFtA7bBa8QXPhriUeolNqqSN0ZLzZF7eD12p+AUhtHUtk7zazAAAAAElFTkSuQmCC"
          />
        )}
      </div>
      {showMenu && (
        <div className="nav-drop-down">
          {/* <div
            className={history.location.pathname === '/' ? 'select' : ''}
            onClick={() => history.push('/')}
          >
            TOP cross-chain
          </div> */}
          <div
            className={
              history.location.pathname === '/integratedCrossChain'
                ? 'select'
                : ''
            }
            onClick={() => history.push('/integratedCrossChain')}
          >
            Integrated cross-chain
          </div>
          <div
            className={history.location.pathname === '/browser' ? 'select' : ''}
            onClick={() => history.push('/browser')}
          >
            Cross-chain records
          </div>
        </div>
      )}

      <div className="top-nav-wrapper">
        <div className="nav-left">
          <a href="/">
            <img className="nav-logo" src={logo} alt="logo" />
          </a>
        </div>
        <div className="nav-center">
          {/* <div
            className={history.location.pathname === '/' ? 'select' : ''}
            style={{ cursor: 'pointer' }}
            onClick={() => history.push('/')}
          >
            TOP cross-chain
          </div> */}
          <div
            className={
              history.location.pathname === '/integratedCrossChain'
                ? 'select'
                : ''
            }
            style={{ cursor: 'pointer' }}
            onClick={() => history.push('/integratedCrossChain')}
          >
            Integrated cross-chain
          </div>
          <div
            className={history.location.pathname === '/browser' ? 'select' : ''}
            style={{ cursor: 'pointer' }}
            onClick={() => history.push('/browser')}
          >
            Cross-chain records
          </div>
        </div>
        {history.location.pathname === '/integratedCrossChain' && (
          <div className="nav-right">
            <CrossChainSelect />
          </div>
        )}
        {history.location.pathname === '/' && (
          <div className="nav-right">
            <SelectChain />

            <div className="top-address">
              {address ? (
                <span onClick={handleClick}>{address}</span>
              ) : (
                <span onClick={enable}>
                  <FormatMessage id="content" />
                </span>
              )}
            </div>
          </div>
        )}
        {history.location.pathname === '/browser' && <div />}
      </div>
      <Dialog
        visible={visible}
        handleClose={handleClose}
        title={<FormatMessage id="account" />}
      >
        <div className="my-account">
          <div className="wallet-address">
            <FormatMessage id="wallet" />
          </div>
          <div className="account-info">
            <div className="account-info-left">
              <img src={eth} alt="eth" />
              {address}
            </div>
            <div className="account-info-right">
              <img
                className="copy"
                onClick={() => handleCopy(account)}
                src={copy}
                alt="copy"
              />
              <a href={linkAddress} onClick={handleClose} target="_blank">
                <img className="link" src={link} alt="link" />
              </a>
            </div>
          </div>
          {topAddr && (
            <div className="account-info top-info">
              <div className="account-info-left">
                <img src={top} alt="top" />
                {TopAddr}
              </div>
              <div className="account-info-right">
                <img
                  className="copy"
                  onClick={() => handleCopy(topAddr)}
                  src={copy}
                  alt="copy"
                />
                <a href={topLink} onClick={handleClose} target="_blank">
                  <img className="link" src={link} alt="link" />
                </a>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default observer(Header);
