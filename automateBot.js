async function startTheBot() {
    console.log("Bot started");
    return lookForSideBar().then(async sideBarData => {
        if (sideBarData.status) {
            await lookForProblemsTab(sideBarData.sidebar);
            await lookForQuizTab(sideBarData.sidebar);
            document.getElementsByClassName("sidebar_backTo_home__zEmhy")[0].click()
            return { status: true };
        } else {
            throw new Error("Sidebar not found");
        }
    }).catch(error => {
        console.error("Error in startTheBot:", error);
        return { status: false };
    });
}

async function lookForSideBar() {
    const sideBarClass = "sidebar_navigation_controls__LySaK";
    return waitForContentToLoad(`.${sideBarClass}`).then(() => {
        const sidebar = document.getElementsByClassName(sideBarClass);
        if (sidebar.length > 0) {
            return { status: true, sidebar: sidebar[0] };
        } else {
            throw new Error("Sidebar element not found");
        }
    }).catch(error => {
        console.error("Error waiting for sidebar:", error);
        return { status: false, sidebar: null };
    });
}

async function lookForProblemsTab(sideBar) {
    let problemsTab = Array.from(sideBar.querySelectorAll('p')).find(p => p.textContent.trim().toLowerCase() === 'problems');
    console.log(problemsTab);
    if (problemsTab) {
        problemsTab.click()
        await problemBot();
        return true
    } else {
        return false
    }
}

async function lookForQuizTab(sideBar) {
    let quizTab = Array.from(sideBar.querySelectorAll('p')).find(p => p.textContent.trim().toLowerCase() === 'quiz');
    console.log(quizTab);
    if (quizTab) {
        quizTab.click()
        await quizBot();
        return true
    } else {
        return false
    }
}


