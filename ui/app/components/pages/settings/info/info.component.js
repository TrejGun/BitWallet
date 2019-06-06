import React, {Component} from "react";
import {FormattedMessage} from "react-intl";
import {Image} from "react-bootstrap";


export default class Info extends Component {
  render () {
    return (
      <div className="settings__content">
        <div className="settings__content-row">
          <div className="settings__content-item settings__content-item--without-height">
            <div className="settings__info-logo-wrapper">
              <Image src="/app/images/wallet_icon.png" height={330} width={330}/>
            </div>
            <div className="settings__info-item">
              <div className="settings__info-version-header">
                <FormattedMessage id="app.name"/>
                {" "}
                <FormattedMessage id="pages.settings.tabs.info.version"/>
              </div>
              <div className="settings__info-version-number">
                {global.platform && global.platform.getVersion() || "N/A"}
              </div>
            </div>
            <div className="settings__info-item">
              <div className="settings__info-about">
                <FormattedMessage id="pages.settings.tabs.info.builtInCalifornia"/>
              </div>
            </div>
          </div>
          <div className="settings__content-item.settings__content-item--without-height">
            <div className="settings__info-link-header">
              <FormattedMessage id="pages.settings.tabs.info.links"/>
            </div>
            <ul className="settings__info-link-item">
              <a href="https://metamask.io/privacy.html" target="_blank">
                <FormattedMessage id="pages.settings.tabs.info.privacyMsg"/>
              </a>
              <a href="https://metamask.io/terms.html" target="_blank">
                <FormattedMessage id="pages.settings.tabs.info.terms"/>
              </a>
              <a href="https://metamask.io/attributions.html" target="_blank">
                <FormattedMessage id="pages.settings.tabs.info.attributions"/>
              </a>
              <hr className="settings__info-separator"/>
              <div className="settings__info-link-item">
                <a href="https://support.metamask.io/" target="_blank">
                  <FormattedMessage id="pages.settings.tabs.info.supportCenter"/>
                </a>
                <a href="https://metamask.io/" target="_blank">
                  <FormattedMessage id="pages.settings.tabs.info.visitWebSite"/>
                </a>
                <a href="mailto:help@metamask.io?subject=Feedback" target="_blank">
                  <FormattedMessage id="pages.settings.tabs.info.emailUs"/>
                </a>
              </div>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

