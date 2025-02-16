// Set the Bootstrap theme based on the user's system preference
const setTheme = () => {
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.body.setAttribute("data-bs-theme", prefersDarkScheme ? "dark" : "light");
};
// Initialize the theme
setTheme();
// Listen for changes in the user's preference
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", setTheme);