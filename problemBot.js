async function problemBot() {
    const problemClass = "sidebar_item__khyNp";
    const targetImageSrc = "https://media.geeksforgeeks.org/img-practice/Group11-1667280519.svg";
    
    try {
        await waitForContentToLoad(`.${problemClass}`);
        let problems = document.querySelectorAll(`.${problemClass}`);
        
        for (let problem of problems) {
            // Check if the problem contains the target image
            const imgTag = problem.querySelector('img');
            if (imgTag && imgTag.src === targetImageSrc) {
                problem.click();
                await solveProblems();
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.log('Problem does not contain the target image or image src does not match.');
            }
        }
    } catch (error) {
        console.error("Error in problemBot:", error);
    }
}


async function solveProblems() {
    const menuItemClass = "problems_header_menu__items__BUrou";
    const submissionText = "submissions";
    const allSubmissionClass = "item";
    const allSubmissionText = "All Submissions";

    try {
        await waitForContentToLoad(`.${menuItemClass}`);

        const menuItems = document.querySelectorAll(`.${menuItemClass}`);
        const submissionMenuItem = Array.from(menuItems).find(item => item.textContent.trim().toLowerCase() === submissionText.toLowerCase());

        if (submissionMenuItem) {
            submissionMenuItem.click();
            console.log("Clicked on the submission menu item.");

            await waitForContentToLoad(`.${allSubmissionClass}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const allSubmissionLink = Array.from(document.querySelectorAll(`.${allSubmissionClass}`))
                .find(link => link.textContent === allSubmissionText);

            if (allSubmissionLink) {
                allSubmissionLink.click();
                await moveCodeToEditor()
                console.log("Clicked on the 'All submission' link.");
            } else {
                console.error("'All submission' link not found.");
            }
        } else {
            console.error(`Menu item with text "${submissionText}" not found.`);
        }
    } catch (error) {
        console.error("Error in solveProblems:", error);
    }
}


async function moveCodeToEditor() {
    const tableClass = "table";
    const actionsDivClass = "editorialSubmission_confirm_modal__9MeXS";
    const moveCodeToEditorWindowClass = "prettyprinted";
    const uiIconButtonsContainerClass = "editorialSubmission_copy_content__7nO3a";

    try {
        await waitForContentToLoad(`.${tableClass}`);
        const table = document.querySelector(`.${tableClass}`);
        const tbody = table.querySelector('tbody');
        
        // Find the row where the <td> with class "editorialSubmission_right_submsn__sYd_m" contains "Correct"
        const correctRow = Array.from(tbody.querySelectorAll('tr')).find(row => {
            const correctTd = row.querySelector('td.editorialSubmission_right_submsn__sYd_m');
            return correctTd && correctTd.innerHTML.trim() === "Correct";
        });

        if (correctRow) {
            const lastTd = correctRow.querySelectorAll('td')[correctRow.querySelectorAll('td').length - 1];
            const anchorTag = lastTd.querySelector('a');

            anchorTag.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const warnActionsDiv = document.querySelector(`.${actionsDivClass}`);
            if (warnActionsDiv) {
                const okButton = warnActionsDiv.querySelectorAll('button')[1];
                okButton.click();
            }
            
            await waitForContentToLoad(`.${moveCodeToEditorWindowClass}`);
            const uiIconButtonsContainer = document.getElementsByClassName(uiIconButtonsContainerClass);
            const uiIconButton = uiIconButtonsContainer[0].querySelectorAll('button')[1];
            uiIconButton.click();
            
            const moveActionsDiv = document.querySelector(`.${actionsDivClass}`);
            if (moveActionsDiv) {
                const okButton = moveActionsDiv.querySelectorAll('button')[1];
                okButton.click();
            }
            
            await submitTheCode();
            return;
        } else {
            console.error("No row with 'Correct' status found.");
        }
    } catch (error) {
        console.error("Error in moveCodeToEditor:", error);
        return;
    }
}


async function submitTheCode(){
    const submitButton = document.getElementsByClassName("problems_submit_button__6QoNQ")[0];
    submitButton.click();
    
    await waitForContentToLoad(`.problems_problem_solved_successfully__Zb4yG`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return
}
