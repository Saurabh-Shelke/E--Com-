import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="mb-4">
        These terms and conditions apply to the YML Mart app (hereinafter
        referred to as the "Application") for mobile devices, developed by
        Yahshua Marketing Limited (hereinafter referred to as the "Service
        Provider") as a free service.
      </p>
      <p className="mb-4">
        By downloading or using the Application, you agree to these terms.
        Please read them carefully before proceeding.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ownership and Restrictions</h2>
        <ul className="list-disc pl-6">
          <li>
            Unauthorized copying, modification, reverse engineering, or creating
            derivative works from the Application or its components is strictly
            prohibited.
          </li>
          <li>
            All intellectual property rights, including trademarks, copyrights,
            and database rights, remain with the Service Provider.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Changes to the Application or Services
        </h2>
        <p>
          The Service Provider may update the Application, introduce changes,
          or impose charges for its services at any time. Any applicable
          charges will be communicated clearly.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Responsibilities</h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>Data Security:</strong> It is your responsibility to ensure
            your device's security and maintain access to the Application.
          </li>
          <li>
            <strong>Device Alterations:</strong> Jailbreaking or rooting your
            device can compromise security and may result in the Application
            malfunctioning, for which the Service Provider is not liable.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
        <p>
          The Application uses third-party services that have their own terms
          and conditions. Below are links to the terms of the third-party
          service providers used:
        </p>
        <ul className="list-disc pl-6">
          <li>Google Play Services</li>
          <li>Facebook</li>
          <li>Mapbox</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Internet and Data Usage</h2>
        <ul className="list-disc pl-6">
          <li>
            The Application requires an active internet connection for certain
            features. The Service Provider is not responsible for limited
            functionality caused by lack of connectivity or exhausted data
            plans.
          </li>
          <li>
            Users are responsible for any charges incurred, including roaming
            charges, from their mobile network provider while using the
            Application.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Accountability</h2>
        <ul className="list-disc pl-6">
          <li>
            The Service Provider is not responsible for issues arising from
            devices running out of battery.
          </li>
          <li>
            Users are responsible for relying on up-to-date and accurate content
            as provided by third parties.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Updates and Compatibility</h2>
        <p>
          Users must update the Application when prompted to ensure optimal
          functionality. The Service Provider does not guarantee compatibility
          with all devices or operating system versions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Termination of Use</h2>
        <p>
          The Service Provider may terminate the Application's availability or
          your rights to use it without prior notice. Upon termination, users
          must discontinue usage and remove the Application from their devices.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Changes to These Terms</h2>
        <p>
          These terms may be updated periodically. Users are encouraged to
          review this page regularly. Updates will be posted on this page, and
          continued use implies acceptance of the revised terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
        <p>
          For questions or suggestions regarding these Terms and Conditions,
          contact the Service Provider at:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:info@ymlmart.com"
            className="text-blue-500 underline"
          >
            info@ymlmart.com
          </a>
        </p>
      </section>

      <p className="text-sm text-gray-600 mt-6">
        <em>Effective Date: October 4, 2024</em>
      </p>
    </div>
  );
};

export default TermsAndConditions;
