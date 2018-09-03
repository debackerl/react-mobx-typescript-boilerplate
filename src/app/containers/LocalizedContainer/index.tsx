import * as React from 'react';
import { InjectedTranslateProps, InjectedI18nProps, translate } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { Locale } from 'antd/lib/locale-provider';
import en from 'antd/lib/locale-provider/en_US';
import fr from 'antd/lib/locale-provider/fr_FR';

// Gets 'language' param from react-router and feed it to i18next.

interface LocaleProviders { [key: string]: Locale; }
const antLocaleProviders: LocaleProviders = {
  en: en,
  fr: fr
};

interface LocalizedContainerProps extends RouteComponentProps<any>, InjectedTranslateProps, InjectedI18nProps {
  
}

export class LocalizedContainer extends React.Component<LocalizedContainerProps, {}> {
  componentWillMount() {
    const language = this.props.match.params.language;
    this.props.i18n.changeLanguage(language);
  }

  // can't use getDerivedStateFromProps(props, state) yet because i18next seems to
  // still use componentWillReceiveProps:
  // Translate(LocalizedContainer) uses getDerivedStateFromProps() but also contains the following legacy lifecycles: componentWillReceiveProps
  UNSAFE_componentWillReceiveProps(nextProps: LocalizedContainerProps) {
    const language = nextProps.match.params.language;

    if(this.props.match.params.language !== language) {
      nextProps.i18n.changeLanguage(language);
    }
  }

  render() {
    const language = this.props.match.params.language;
    const children = this.props.children as any as React.ReactElement<any>;
    return <LocaleProvider locale={antLocaleProviders[language]}>
      {children}
    </LocaleProvider>;
  }
}

export default withRouter(translate([])(LocalizedContainer));
