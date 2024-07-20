// #returns arrays of p tags with their a tags 
function checkForSection() {
    // Locate the parent div using XPath
    const section_parent_div = document.evaluate(
        '//*[@id="__next"]/div/section/div[2]/div[2]/div/div[1]/section/div',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    let returnMessage = {
        titles: [],
        aTags: [],
        totalModules: 0
    };

    if (section_parent_div) {
        const pTags = Array.from(section_parent_div.querySelectorAll('p.batch_tab_heading__h9TUx'));

        if (pTags.length > 0) {
            // console.log(`Found ${pTags.length} <p> tags with class name "batch_tab_heading__h9TUx"`);

            pTags.forEach(pTag => {
                let nextDiv = pTag.nextElementSibling;
                if (nextDiv && nextDiv.tagName === 'DIV') {
                    // Check all nested <span> tags within the next <div>
                    const spanTags = Array.from(nextDiv.querySelectorAll('span'));
                    const containsKeyword = spanTags.some(span =>
                        span.textContent.includes("MCQ's") || span.textContent.includes("Problems")
                    );

                    if (containsKeyword) {
                        // Select <a> tags whose parent <div> has class "batch_content__HAEMJ"
                        const aTags = Array.from(nextDiv.querySelectorAll('div.batch_content__HAEMJ a'));
                        const pTagTitle = pTag.textContent;
                        if (aTags.length > 0) {
                            returnMessage.titles.push(pTagTitle);
                            returnMessage.aTags.push({
                                mcqCounts: aTags.filter(a => a.textContent.includes("MCQ")).length,
                                problemsCounts: aTags.filter(a => a.textContent.includes("Problems")).length,
                                hrefs: aTags.map(a => a.href) // Store hrefs instead of actual elements
                            });
                        } else {
                            // console.log('No <a> tags found with parent div class "batch_content__HAEMJ".');
                        }
                    } else {
                        // console.log('Sibling <div> does not contain nested <span> with "MCQ\'s" or "problems".');
                    }
                } else {
                    // console.log('No sibling <div> found.');
                }
            });
        } else {
            // console.log('No <p> tags with class name "batch_tab_heading__h9TUx" found.');
        }
        returnMessage.totalModules = pTags.length;
        return returnMessage;
    } else {
        // console.log("section_parent_div not found");
    }

    return returnMessage;
}
