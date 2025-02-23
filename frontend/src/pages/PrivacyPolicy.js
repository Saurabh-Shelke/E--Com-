import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-700 mb-6">
          This privacy policy is applicable to the YML Mart app (hereinafter
          referred to as "Application") for mobile devices, which was developed
          by Yahshua Marketing Limited (hereinafter referred to as "Service
          Provider") as a Free service. This service is provided "AS IS".
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            What Information Does the Application Obtain and How is it Used?
          </h2>
          <p className="text-gray-700">
            The Application acquires the information you supply when you
            download and register the Application. Registration with the
            Service Provider is not mandatory. However, some features may be
            unavailable unless you register.
          </p>
          <p className="text-gray-700 mt-4">
            The Service Provider may use the information you provide to contact
            you for important notices, marketing promotions, or other relevant
            information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Automatically Collected Information
          </h2>
          <p className="text-gray-700">
            The Application may collect certain information automatically,
            including the type of mobile device you use, unique device ID, IP
            address, mobile operating system, browser type, and usage
            information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Location Information
          </h2>
          <p className="text-gray-700">
            The Application collects your device's location to provide
            geolocation services, analytics, and improvements, as well as to
            optimize functionality and features.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Third-Party Services
          </h2>
          <p className="text-gray-700">
            The Application uses third-party services like Google Play Services,
            Facebook, and Mapbox, which may collect information under their
            respective Privacy Policies.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Data Retention
          </h2>
          <p className="text-gray-700">
            User Provided Data is retained as long as you use the Application.
            Automatically Collected Data is retained for up to 24 months, after
            which it is stored in aggregate. For deletion requests, contact
            yahshuamarketing@gmail.com.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Children
          </h2>
          <p className="text-gray-700">
            The Application does not knowingly collect data from children under
            the age of 13. If such data is discovered, it will be deleted
            promptly. Contact yahshuamarketing@gmail.com if you have concerns.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Security
          </h2>
          <p className="text-gray-700">
            The Service Provider employs physical, electronic, and procedural
            safeguards to protect your information. However, no security system
            is impenetrable.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Changes to this Policy
          </h2>
          <p className="text-gray-700">
            This Privacy Policy may be updated periodically. Continued use of
            the Application indicates acceptance of any changes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Contact Us
          </h2>
          <p className="text-gray-700">
            For any privacy-related concerns, please reach out to us at{" "}
            <a
              href="mailto:info@ymlmart.com"
              className="text-blue-600 underline"
            >
              info@ymlmart.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
