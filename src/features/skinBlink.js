let show = false;

const toggleSkin = () => {
    show = !show
    bot.setSettings({
        skinParts: {
            showJacket: show,
            showHat: show,
            showRightPants: show,
            showLeftPants: show,
            showLeftSleeve: show,
            showRightSleeve: show
        }
    });
};

module.exports = { toggleSkin };