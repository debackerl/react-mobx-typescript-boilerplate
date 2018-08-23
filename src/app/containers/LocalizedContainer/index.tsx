import * as React from 'react';
import { InjectedTranslateProps, InjectedI18nProps, translate } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';

// Gets 'language' param from react-router and feed it to i18next.

interface LocalizedContainerProps extends RouteComponentProps<any>, InjectedTranslateProps, InjectedI18nProps {
  
}

export class LocalizedContainer extends React.Component<LocalizedContainerProps, {}> {
  componentWillMount() {
    const language = this.props.match.params.language;
    this.props.i18n.changeLanguage(language);
  }

  UNSAFE_componentWillReceiveProps(nextProps: LocalizedContainerProps) {
    const language = nextProps.match.params.language;

    if(this.props.match.params.language !== language) {
      nextProps.i18n.changeLanguage(language);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(translate([])(LocalizedContainer));
