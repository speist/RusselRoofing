import React from "react";
import FloatingPageLayout from "@/components/layout/FloatingPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Russell Roofing & Exteriors",
  description: "Privacy Policy for Russell Roofing & Exteriors - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <FloatingPageLayout>
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-500">Last updated: December 02, 2025</p>
          </div>

          {/* Content */}
          <div className="space-y-10">
            {/* Introduction */}
            <section className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                This Privacy Notice for <strong>Russell Roofing, Inc.</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), describes how and why we might access, collect, store, use, and/or share (&quot;process&quot;) your personal information when you use our services (&quot;Services&quot;), including when you:
              </p>
              <ul className="list-disc pl-8 space-y-2 text-gray-700">
                <li>Visit our website at <span className="text-primary-burgundy">russellroofing.com</span> or any website of ours that links to this Privacy Notice</li>
                <li>Engage with us in other related ways, including any marketing or events</li>
              </ul>
              <div className="bg-gray-50 border-l-4 border-primary-burgundy p-4 mt-6">
                <p className="text-gray-700">
                  <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at{" "}
                  <a href="mailto:info@russellroofing.com" className="text-primary-burgundy hover:underline font-medium">
                    info@russellroofing.com
                  </a>.
                </p>
              </div>
            </section>

            {/* Summary of Key Points */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                Summary of Key Points
              </h2>
              <p className="text-gray-600 italic">
                This summary provides key points from our Privacy Notice.
              </p>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-gray-200">
                  <p className="text-gray-700">
                    <strong>What personal information do we process?</strong><br />
                    When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-gray-200">
                  <p className="text-gray-700">
                    <strong>Do we process any sensitive personal information?</strong><br />
                    We do not process sensitive personal information.
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-gray-200">
                  <p className="text-gray-700">
                    <strong>Do we collect any information from third parties?</strong><br />
                    We do not collect any information from third parties.
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-gray-200">
                  <p className="text-gray-700">
                    <strong>How do we process your information?</strong><br />
                    We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-gray-200">
                  <p className="text-gray-700">
                    <strong>How do we keep your information safe?</strong><br />
                    We have adequate organizational and technical processes and procedures in place to protect your personal information.
                  </p>
                </div>
              </div>
            </section>

            {/* Table of Contents */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                Table of Contents
              </h2>
              <ol className="list-decimal pl-8 space-y-2 text-primary-burgundy">
                <li><a href="#section1" className="hover:underline">What Information Do We Collect?</a></li>
                <li><a href="#section2" className="hover:underline">How Do We Process Your Information?</a></li>
                <li><a href="#section3" className="hover:underline">When and With Whom Do We Share Your Personal Information?</a></li>
                <li><a href="#section4" className="hover:underline">Do We Use Cookies and Other Tracking Technologies?</a></li>
                <li><a href="#section5" className="hover:underline">How Long Do We Keep Your Information?</a></li>
                <li><a href="#section6" className="hover:underline">How Do We Keep Your Information Safe?</a></li>
                <li><a href="#section7" className="hover:underline">Do We Collect Information from Minors?</a></li>
                <li><a href="#section8" className="hover:underline">What Are Your Privacy Rights?</a></li>
                <li><a href="#section9" className="hover:underline">Controls for Do-Not-Track Features</a></li>
                <li><a href="#section10" className="hover:underline">Do United States Residents Have Specific Privacy Rights?</a></li>
                <li><a href="#section11" className="hover:underline">Do We Make Updates to This Notice?</a></li>
                <li><a href="#section12" className="hover:underline">How Can You Contact Us About This Notice?</a></li>
                <li><a href="#section13" className="hover:underline">How Can You Review, Update, or Delete the Data We Collect from You?</a></li>
              </ol>
            </section>

            {/* Section 1 */}
            <section id="section1" className="space-y-4 scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                1. What Information Do We Collect?
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6">
                Personal Information You Disclose to Us
              </h3>
              <p className="text-gray-600 italic">
                <strong>In Short:</strong> We collect personal information that you provide to us.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="font-semibold text-gray-800 mb-3">Personal Information Provided by You may include:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3"></span>
                    Names
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3"></span>
                    Phone numbers
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3"></span>
                    Email addresses
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3"></span>
                    Mailing addresses
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3"></span>
                    Contact preferences
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3"></span>
                    Contact or authentication data
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-8">
                Information Automatically Collected
              </h3>
              <p className="text-gray-600 italic">
                <strong>In Short:</strong> Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Like many businesses, we also collect information through cookies and similar technologies.
              </p>
            </section>

            {/* Section 2 */}
            <section id="section2" className="space-y-4 scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                2. How Do We Process Your Information?
              </h2>
              <p className="text-gray-600 italic">
                <strong>In Short:</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We process your personal information for a variety of reasons, depending on how you interact with our Services, including:
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start text-gray-700">
                  <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3 mt-2"></span>
                  <span>To deliver and facilitate delivery of services to the user</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3 mt-2"></span>
                  <span>To respond to user inquiries/offer support to users</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3 mt-2"></span>
                  <span>To send administrative information to you</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3 mt-2"></span>
                  <span>To fulfill and manage your orders</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3 mt-2"></span>
                  <span>To request feedback</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3 mt-2"></span>
                  <span>To send you marketing and promotional communications</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3 mt-2"></span>
                  <span>To protect our Services</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3 mt-2"></span>
                  <span>To identify usage trends</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="w-2 h-2 bg-primary-burgundy rounded-full mr-3 mt-2"></span>
                  <span>To save or protect an individual&apos;s vital interest</span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="section3" className="space-y-4 scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                3. When and With Whom Do We Share Your Personal Information?
              </h2>
              <p className="text-gray-600 italic">
                <strong>In Short:</strong> We may share information in specific situations described in this section and/or with the following third parties.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We may need to share your personal information in the following situations:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong className="text-gray-900">Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="section4" className="space-y-4 scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                4. Do We Use Cookies and Other Tracking Technologies?
              </h2>
              <p className="text-gray-600 italic">
                <strong>In Short:</strong> We may use cookies and other tracking technologies to collect and store your information.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements, to tailor advertisements to your interests, or to send abandoned shopping cart reminders (depending on your communication preferences).
              </p>
            </section>

            {/* Section 5 */}
            <section id="section5" className="space-y-4 scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                5. How Long Do We Keep Your Information?
              </h2>
              <p className="text-gray-600 italic">
                <strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
              </p>
            </section>

            {/* Section 6 */}
            <section id="section6" className="space-y-4 scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                6. How Do We Keep Your Information Safe?
              </h2>
              <p className="text-gray-600 italic">
                <strong>In Short:</strong> We aim to protect your personal information through a system of organizational and technical security measures.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.
              </p>
            </section>

            {/* Section 7 */}
            <section id="section7" className="space-y-4 scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                7. Do We Collect Information from Minors?
              </h2>
              <p className="text-gray-600 italic">
                <strong>In Short:</strong> We do not knowingly collect data from or market to children under 18 years of age.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent&apos;s use of the Services.
              </p>
            </section>

            {/* Section 8 */}
            <section id="section8" className="space-y-4 scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                8. What Are Your Privacy Rights?
              </h2>
              <p className="text-gray-600 italic">
                <strong>In Short:</strong> You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Withdrawing your consent:</strong> If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us using the contact details provided below.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                If you have questions or comments about your privacy rights, you may email us at{" "}
                <a href="mailto:info@russellroofing.com" className="text-primary-burgundy hover:underline font-medium">
                  info@russellroofing.com
                </a>.
              </p>
            </section>

            {/* Section 9 */}
            <section id="section9" className="space-y-4 scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                9. Controls for Do-Not-Track Features
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (&quot;DNT&quot;) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.
              </p>
            </section>

            {/* Section 10 */}
            <section id="section10" className="space-y-4 scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                10. Do United States Residents Have Specific Privacy Rights?
              </h2>
              <p className="text-gray-600 italic">
                <strong>In Short:</strong> If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Montana, New Hampshire, New Jersey, Oregon, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                We have collected the following categories of personal information in the past twelve (12) months:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4 space-y-4">
                <div>
                  <p className="font-semibold text-gray-800">Identifiers</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Internet or Other Similar Network Activity</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements
                  </p>
                </div>
              </div>
            </section>

            {/* Section 11 */}
            <section id="section11" className="space-y-4 scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                11. Do We Make Updates to This Notice?
              </h2>
              <p className="text-gray-600 italic">
                <strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Notice from time to time. The updated version will be indicated by an updated &quot;Revised&quot; date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
              </p>
            </section>

            {/* Section 12 */}
            <section id="section12" className="space-y-4 scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                12. How Can You Contact Us About This Notice?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions or comments about this notice, you may email us at{" "}
                <a href="mailto:info@russellroofing.com" className="text-primary-burgundy hover:underline font-medium">
                  info@russellroofing.com
                </a>{" "}
                or contact us by post at:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <address className="not-italic text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">Russell Roofing, Inc.</strong><br />
                  1200 Pennsylvania Ave<br />
                  Oreland, PA 19075<br />
                  United States<br />
                  <span className="text-primary-burgundy">Phone: 1-888-567-7663</span>
                </address>
              </div>
            </section>

            {/* Section 13 */}
            <section id="section13" className="space-y-4 scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                13. How Can You Review, Update, or Delete the Data We Collect from You?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                To request to review, update, or delete your personal information, please contact us at{" "}
                <a href="mailto:info@russellroofing.com" className="text-primary-burgundy hover:underline font-medium">
                  info@russellroofing.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </FloatingPageLayout>
  );
}
