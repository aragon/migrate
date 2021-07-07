import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Disclaimer from './components/Disclaimer/Disclaimer'
import GetStarted from './components/GetStarted/GetStarted'
import Migrate from './components/Migrate/Migrate'

export const CONVERTER_PATH = '/converter'
export const REDEEM_ANJ_PATH = '/redeem-anj'
export const REDEEM_ANJ_LOCK_PATH = '/redeem-anj-lock'
export const DISCLAIMER_PATH = '/disclaimer'

export default function Routes(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/" component={GetStarted} />
      <Route exact path={DISCLAIMER_PATH} component={Disclaimer} />
      <Route
        exact
        path={CONVERTER_PATH}
        render={() => <Migrate conversionType="ANT" />}
      />
      <Route
        exact
        path={REDEEM_ANJ_PATH}
        render={() => <Migrate conversionType="ANJ" />}
      />
      <Route
        exact
        path={REDEEM_ANJ_LOCK_PATH}
        render={() => <Migrate conversionType="ANJ-LOCK" />}
      />
      <Redirect to="/" />
    </Switch>
  )
}
