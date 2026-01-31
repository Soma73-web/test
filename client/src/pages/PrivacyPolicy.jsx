import React from 'react';

const PrivacyPolicy = () => {
  return (
    <section className="pt-28 pb-16 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        Vagus NEET Academy is committed to protecting your privacy. We collect basic contact
        information solely for communication and academic services. We do not sell or share your
        personal data with third parties.
      </p>
      <p className="mb-4">
        Our website may use cookies to improve your experience. You can disable cookies through your
        browser settings.
      </p>
      <p>
        If you have any concerns regarding your data, please contact us at{' '}
        <a href="mailto:info@vagusneetacademy.com" className="text-indigo-600 underline">
          info@vagusneetacademy.com
        </a>.
      </p>
    </section>
  );
};

export default PrivacyPolicy;
