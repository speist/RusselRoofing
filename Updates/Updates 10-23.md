🏠 Home Page
1. Header/Logo Alignment

    a. Move the Russell Roofing logo to align horizontally with the "Russell Roofing" overlay text.

    b. Move the "Contact Us" button to align horizontally with the "Request Estimate" overlay text.

    c. See screenshot Updates/HomeHerochange.png for example

2. "Why Choose Us" Section

    a. Change this section to use flip cards (similar to the "We're Hiring" section).

    b.Use placeholder text in the cards for now.

3. "Get in Touch" Section (Functionality)

    a. Add Hubspot integration on form submission.

    b. The submission must create a new Contact and a new Deal in Hubspot.

    c. Set the new Deal's stage to "5% Lead".

    d. Capture all form submission data and populate it in both the Contact and Deal records.

4. Footer

    a. Clean up all footer image links:

        i. The "Quick Links" section must match the links in the main navigation.

        ii.Add a new link for Community (this will be a new page).

        iii. IMPORTANT: This updated footer must be applied to ALL pages on the site.

📄 About Page
1. Hero Section

    a. Remove the "Years of Exp," "Expert Team," and "Homes Protected" elements from the top banner.

2. Content Updates

    a. Change "The Our Journey" content to the following:

        i.Russell Kaller founded Russell Roofing in 1992 with the goal to serve honorably and profit by it, with the motto if it’s Russell it’s right.

        ii.In 1993 Russell Roofing landed its first major project, a cedar reroof for six figures on a well known Main Line property. This launched Russell Roofing to become one of the premier roofing contractors in the Philadelphia area.

        iii.1999 National Roofing Contractors Association Award for Finalist For Outstanding Workmanship for Work on Chambers Memorial Presbyterian Church Rutledge, PA

        iv.1999 National Roofing Contractors Association Award for Finalist for Community Service for Tabernacle of Faith Church Camden, NJ

        v.2009 National Roofing Contractors Association Award for Finalist

        vi.2014 National Roofing Contractors Association Award for Finalist For Outstanding Workmanship on Overbrook School for the Blind

    b. Change the "Our Vision" section title to "Our Mission".

    c. Update the text below "Our Mission" to:

Our company slogan, “If It’s Russell, It’s Right, Guaranteed!” is more than just words. It represents how we run our business with a “can do” attitude. Our goal is to make your roofing or exterior remodeling experience as comfortable as possible by providing the highest quality warranties, workers, and communication.

Referrals are the core of our business, and we aim to make our customers 100% satisfied. We are a safety-first company that is fully licensed and insured, with liability and full workers’ compensation coverage.

    d. Ad a placeholder for an image to be placed on each timeline item

3. "Meet Our Team" Section

    a. Change the layout to be 3 cards across (currently 2).

    b. On each team member card, remove the "Experience," "Specialties," and "Certifications" sections.

4. "Professional Credentials" Section

    a. Change the section title to "Professional Awards".

    b. Remove the "Industry Certifications" sub-header.

    c. Redesign the cards: Shrink each card to only show the award image and the award title.

    d. Use the provided screenshot, Updates/awards.png, for the items to include

5. "Community Involvement" Section (New Page Creation)

    a. Remove this section entirely from the About page.

    b. Create a new, separate page titled "Community".

    c. Add Community to the main navigation bar.

    d. New Community Page Requirements:

        i. Use the standard header/hero image with the page title "Community".

        ii. Add a sub-header: "Something about Russell Roofing helping out in the community."

        iii. Display content using the same card layout as the "News" page's blog posts (image, title, short blurb).

        iv. This page will eventually pull data dynamically from a Hubspot Custom Object.

        v. For now, use the links below to gather placeholder content (logos, titles, blurbs):

NRCA - National Roofing Contractors Association

GAF President's Club

Certainteed Advisory Council

Main Line Chamber of Commerce

Montgomery County Chamber of Commerce

BNI – Business Networking International (Jenkintown & Center City Chapters)

Philadelphia Historical Society

Preservation Alliance of Greater Philadelphia

Rock Ministry

6. "Quality Materials" Section

    a. Bug Fix: Images are still not appearing in this section. This needs to be fixed.

    b. Change the text under the header to:

Russell Roofing and Exteriors is a factory-certified installer for the best manufacturers in the industry. To gain factory certification from a roofing manufacturer or maker of other building components, certified roofing contractors must demonstrate superior product knowledge, financial stability, proven commitment to staff training and education, and a high level of customer service. Being a factory-certified installer allows us to provide our customers with a material and workmanship warranty through the manufacturer.

🛠️ Services Page (Main)
1. Remove the "Why Choose Russell Roofing" section.

🔩 Individual Service Pages (Sub-Pages)
(Example: /services/roofing)

1. Template Cleanup: Make the following changes to one service sub-page (e.g., Roofing) to create a new template.

    a. Remove the "Professional Credentials" section (located in "About Our Roofing").

    b. Remove the "Our Process" section.

    c. Remove the "Ready to get started?" section.

    d. Remove the "What Our Customers Say" section.

    e. Remove the "Related Services" section.

2. Apply Template: After the template is complete, apply this same clean layout to all other individual service sub-pages.

3. Gallery

a. Add in default images from the current site.

b. (Let me know when this task starts, and I will prepare the images.)

📰 News Page
1. Blog Filtering/Search

    a. Implement blog post filtering using the existing tags (currently, the filter only shows "All").

    b. Add a search bar to search blog post titles/content.

2. Blog Post Content Bug

    a. Bug Fix: When a blog post is selected, the blog content is duplicated at the top of the page.

    b. Remove this unformatted, duplicated content. (Keep the main, correctly formatted title).

👨‍💼 Careers Page
1. Remove the "Why Choose Russell Roofing" section.

2. Dynamic Job Postings

    a. Connect this page to the Hubspot Custom Object Careers.

    b. Dynamically pull and display all job openings from this object.

    (Note: I still need to add a "live" flag/property in Hubspot for filtering, so the site knows which postings are active).

✉️ Estimate Page
1. Form Bug

a. Needs Review: The address input field is bugged. It only allows one letter to be typed before it locks the field.

b. The user is still able to proceed to the next page, but the address field is unusable.