import React, { useEffect, useContext } from 'react';
import { MobXProviderContext, observer } from 'mobx-react';
import FormatMessage from '@/locale/FormatMessage';
import './index.less';

const BitcoinSvg = require('@/assets/images/footer/bitcoin.svg').default;
const DiscordSvg = require('@/assets/images/footer/discord.svg').default;
const FacebookSvg = require('@/assets/images/footer/facebook.svg').default;
const MediumSvg = require('@/assets/images/footer/medium.svg').default;
const RedditSvg = require('@/assets/images/footer/reddit.svg').default;
const SteemitSvg = require('@/assets/images/footer/steemit.svg').default;
const TelegramSvg = require('@/assets/images/footer/telegram.svg').default;
const TopSvg = require('@/assets/images/footer/top.svg').default;
const TwitterSvg = require('@/assets/images/footer/twitter.svg').default;

const addEmail = (callback?: any) => {
  const e = 'ml';
  (window as any).MailerLiteObject = e;
  function f(this: any) {
    const c = { a: arguments, q: [] };
    const r = this.push(c);
    return typeof r !== 'number' ? r : f.bind(c.q); // eslint-disable-line
  }
  f.q = f.q || [];
  window[e] = window[e] || f.bind(f.q);
  window[e].q = window[e].q || f.q;
  const r: any = document.createElement('script');
  r.onload = callback;
  const _ = document.getElementsByTagName('script')[0];
  r.async = 1;
  r.src =
    'https://static.mailerlite.com/js/universal.js' +
    '?v' +
    parseInt(String(new Date().getTime() / 1000000), 10);
  _.parentNode.insertBefore(r, _);

  const xx = (window as any).ml;
  console.log(xx()); 
};
const setPlaceholder = text => {
  setTimeout(() => {
    if (document.getElementsByClassName('form-control')[0]) {
      (document.getElementsByClassName(
        'form-control'
      )[0] as any).placeholder = text;
    } else {
      setPlaceholder(text);
    }
  }, 100);
};

const Footer: React.FunctionComponent = () => {
  const {
    locale: { lan, getLocaleMessage },
  } = useContext(MobXProviderContext);
  const text = getLocaleMessage('footer.placeholder');
  useEffect(() => {
    setPlaceholder(text);
  }, [lan]);
  useEffect(() => {
    addEmail();
  }, []);

  const links = [
    { href: 'https://t.me/topnetwork_top', icon: <TelegramSvg />, blank: true },
    {
      href: 'https://twitter.com/topnetwork_top',
      icon: <TwitterSvg />,
      blank: true,
    },
    {
      href: 'https://www.facebook.com/topnetworktop/',
      icon: <FacebookSvg />,
      blank: true,
    },
    {
      href: 'https://medium.com/@topnetwork',
      icon: <MediumSvg />,
      blank: true,
    },
    { href: 'https://www.topnetwork.org/blog/', icon: <TopSvg />, blank: true },
    { href: 'https://discord.gg/ARMNKCH', icon: <DiscordSvg />, blank: true },
    {
      href: 'https://www.reddit.com/r/TOP_Network/',
      icon: <RedditSvg />,
      blank: true,
    },
    { href: 'https://bitcointalk.org', icon: <BitcoinSvg />, blank: true },
    {
      href: 'https://steemit.com/@topnetwork-top',
      icon: <SteemitSvg />,
      blank: true,
    },
  ];

  return (
    <footer className="footer">
      <section className="footer-bottom">
        <div
          className="ml-form-embed"
          data-account="1319000:x0x0a0p6w2"
          data-form="1153002:f1d6p9"
        />
        <div className="footer-bottom__links">
          {links.map((link, index) => (
            <a
              key={index}
              href={
                link.href
                  ? link.href === 'wechat'
                    ? undefined
                    : link.href
                  : undefined
              }
              target={link.blank ? '_blank' : undefined}
              rel={link.blank ? 'noopener noreferrer' : undefined}
            >
              {link.icon}
            </a>
          ))}
        </div>
        <div className="footer-bottom__service">
          <a href="https://www.topnetwork.org/en/terms" target="_blank">
            <FormatMessage id="footer.service" />
          </a>
          <span>|</span>
          <a href="https://www.topnetwork.org/en/policy" target="_blank">
            <FormatMessage id="footer.privacy" />
          </a>
        </div>
        <div className="footer-bottom__copyright">
          Copyright © {new Date().getFullYear()} Telos Foundation All rights
          reserved
        </div>
      </section>
    </footer>
  );
};

export default observer(Footer);
