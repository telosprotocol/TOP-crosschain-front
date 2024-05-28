import React, { Suspense, Component, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Loading } from '@/components';

const Home = lazy(() => import('@/pages/Home'));

// const Exchange = lazy(() => import('@/pages/Exchange'));
const IntegratedCrossChain = lazy(() => import('@/pages/IntegratedCrossChain'));

// const ExchangeRecord = lazy(() => import('@/pages/ExchangeRecord'));
const Browser = lazy(() => import('@/pages/Browser'));
const Report = lazy(() => import('@/pages/Report'));

export default class Routes extends Component {
  public render() {
    return (
      <Suspense fallback={Loading}>
        <Switch>
          {/* <Route path="/" exact={true} component={IntegratedCrossChain} /> */}
          {/* <Route path="/exchange" exact={true} component={Exchange} /> */}
          <Route path="/integratedCrossChain" exact={true} component={IntegratedCrossChain} />
          {/* <Route path="/bind" exact={true} component={BindAddress} /> */}
          {/* <Route path="/record" exact={true} component={ExchangeRecord} /> */}
          <Route path="/browser" exact={true} component={Browser} />
          <Route path="/report" exact={true} component={Report} />
          <Redirect to="/integratedCrossChain" />
        </Switch>
      </Suspense>
    );
  }
}
