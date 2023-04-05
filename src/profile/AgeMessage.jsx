import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

function AgeMessage({ accountSettingsUrl }) {
  return (
    <Alert
      id="messages"
      variant="info"
      dismissible={false}
      show
    >
      <p className="share-button">
        <FormattedMessage
          id="profile.share"
          defaultMessage="Share"
          description="Error message"
        />
      </p>
      <p className="profile-shared">
        <Alert.Heading id="profile.shared">
          <FormattedMessage
            id="profile.shared"
            defaultMessage="Your profile cannot be shared."
            description="Error message"
          />
        </Alert.Heading>
      </p>

      <FormattedMessage
        id="profile.age.details"
        defaultMessage="To share your profile with other {siteName} learners, you must confirm that you are over the age of 13."
        description="Error message"
        tagName="p"
        values={{
          siteName: getConfig().SITE_NAME,
        }}
      />
      <Alert.Link href={accountSettingsUrl}>
        <FormattedMessage
          id="profile.age.set.date"
          defaultMessage="Set your date of birth"
          description="Label on a link to set birthday"
        />
      </Alert.Link>
    </Alert>
  );
}

AgeMessage.propTypes = {
  accountSettingsUrl: PropTypes.string.isRequired,
};

export default AgeMessage;
