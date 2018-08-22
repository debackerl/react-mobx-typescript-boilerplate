import * as React from 'react';
import { InjectedTranslateProps, InjectedI18nProps, translate } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';

// Gets 'language' param from react-router and feed it to i18next.

interface LocalizedContainerProps extends RouteComponentProps<any>, InjectedTranslateProps, InjectedI18nProps {
  
}

export class _LocalizedContainer extends React.Component<LocalizedContainerProps, any> {
  shouldComponentUpdate(nextProps: LocalizedContainerProps, nextState: any) {
    const language = nextProps.match.params.language || nextProps.i18n.options.fallbackLng;
    if(this.props.match.params.language !== language) {
      nextProps.i18n.changeLanguage(language);
      return true;
    }
    return false;
  }

  render() {
    return this.props.children;
  }
}

export const LocalizedContainer = withRouter(translate([])(_LocalizedContainer));
export default LocalizedContainer;
