async function loadApp() {
    const { app } = await import("./app.js"); // this is your normal entry file>
}
loadApp();
