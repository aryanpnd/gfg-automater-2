async function quizBot() {
    const quizDivClass = "sidebar_quiz_questions__flex__pZwwT";
    try {
        await waitForContentToLoad(`.${quizDivClass}`);
        let quizes = document.querySelectorAll(`.${quizDivClass} > div`);
        console.log(quizes);
        for (let quiz of quizes) {
            quiz.click();
            await solveQuiz()
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (error) {
        console.error("Error in quizBot:", error);
    }
}

async function solveQuiz() {
    const quizOptionsClass = "track_question_choices__tzdro";
    const submitButtonClass = "track_question_buttons_contents__ep9Y6";
    const submissionText = "submitted";

    try {
        console.log("Waiting for quiz options to load...");
        await waitForContentToLoad(`.${quizOptionsClass}`);
        console.log("Quiz options loaded.");

        // Click the first quiz option
        const options = document.querySelectorAll(`.${quizOptionsClass} > div, .${quizOptionsClass} > label`);
        if (options.length > 0) {
            options[0].click();
            console.log("Quiz option clicked.");
        } else {
            console.error("No quiz options found.");
            return;
        }

        // Wait for the submit button container to appear
        const buttonContainer = document.getElementsByClassName(submitButtonClass)[0];
        if (buttonContainer) {
            const buttons = buttonContainer.querySelectorAll("button");
            console.log("Buttons found:", buttons.length);

            if (buttons.length > 1) {
                const secondButton = buttons[1];
                console.log("Second button text:", secondButton.innerText.trim());

                if (secondButton.innerText.trim().toLowerCase() === submissionText.toLowerCase()) {
                    console.log("Button already submitted. Moving to the next quiz.");
                    return;
                }

                secondButton.click();
                console.log("Submit button clicked.");

                // Wait for the submission status to change
                await waitForSubmission(submitButtonClass, submissionText);
                console.log("Submission status updated.");
            } else {
                console.error("Submit button not found");
            }
        } else {
            console.error("Button container not found");
        }

    } catch (error) {
        console.error("Error while solving quiz:", error);
    }
}

