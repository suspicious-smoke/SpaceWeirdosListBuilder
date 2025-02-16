function selectedSelect(list_name, selected_text) {
    resetSelect(list_name);
    let select_list = document.getElementById(list_name);
    for(let i=0; i < select_list.options.length; i++) {
        if (select_list.options[i].text == selected_text) {
            select_list.options[i].selected = true;
        }
    }
}


function resetSelect(list_name) {
    let select_list = document.getElementById(list_name);
    for(let i=0; i < select_list.options.length; i++) {
        select_list.options[i].selected = false;
    }
    select_list.options[0].selected = true;
}


function fadeInOut(id) {
    const alert = document.getElementById(id);
    // prevent running multiple times
    if (alert.style.opacity < 0) {
        alert.style.opacity = 0;
    }
    if (alert.style.opacity != 0) {
        return;
    }
    let opacity = 0; // Initial opacity
    alert.style.display = 'block'; // Make sure the element is visible
    // Fade in
    const fadeInEffect = setInterval(() => {
        if (opacity >= 1) {
        clearInterval(fadeInEffect); // Stop fade-in
        setTimeout(() => fadeOut(), 500); // Wait 1 second before starting fade-out
        } else {
        opacity += 0.1; // Increase opacity
        alert.style.opacity = opacity;
        }
    }, 50); // Interval of 50ms
    function fadeOut() {
        // Fade out
        const fadeOutEffect = setInterval(() => {
        if (opacity <= 0) {
            clearInterval(fadeOutEffect); // Stop fade-out
            alert.style.display = 'none'; // Hide the element
        } else {
            opacity -= 0.1; // Decrease opacity
            alert.style.opacity = opacity;
        }
        }, 50); // Interval of 50ms
    }
}


// turn first character to upper case
function fUpper(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}


// get cost of each weirdo stat and post it in relevant places
function deleteEventListeners(id) {
    const items = document.querySelectorAll(id);
    items.forEach(item => {
        item.replaceWith(item.cloneNode(true));
    });
}


function close_accordions() {
    document.querySelectorAll('.accordion .collapse').forEach(function(collapseElement) {
        const bsCollapse = new bootstrap.Collapse(collapseElement, { toggle: false });
        bsCollapse.hide(); // Close all accordion items
    });
}

export {selectedSelect, resetSelect, fadeInOut, fUpper, deleteEventListeners, close_accordions};