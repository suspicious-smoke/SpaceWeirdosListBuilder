
// window.onload = function() {
//     const userData = localStorage.getItem('token'); // Get user data from localStorage

//     if (userData) {
//         // If user data exists, show a welcome message
//         document.getElementById('userInfo').innerHTML = `Welcome back, ${userData}!`;

//         // Optionally, send data to Flask backend if necessary
//         fetch('http://127.0.0.1:5000/handle_localstorage', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ userName: userData })
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Response from server:', data);
//         })
//         .catch(error => {
//             console.error('Error sending data to Flask:', error);
//         });
//     } else {
//         // If no user data exists in localStorage, ask user for name
//         const userName = prompt("Enter your name:");
//         localStorage.setItem('userName', userName);  // Save data to localStorage
//         document.getElementById('userInfo').innerHTML = `Hello, ${userName}!`;
//     }
// };

window.onload = function() {
    // button to save flask data
    document.getElementById('loadDataExample').addEventListener('click', function() {
        let token = localStorage.setItem('token','yayayaya token')
        document.getElementById('response').textContent = 'added'
        // fetch('http://127.0.0.1:5000/postdata', {
        //     method: 'POST',  // HTTP method
        //     headers: {
        //         'Content-Type': 'application/json',  // Specify that we are sending JSON
        //     },
        //     body: JSON.stringify(token)  // Convert the data object into a JSON string
        // })
        // .then(response => response.json())  // Parse JSON response from Flask server
        // .then(data => {
        //     console.log('Success:', data);
        //     alert('Server Response: ' + data.message);
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        //     alert('Failed to send data');
        // });
    });

    document.getElementById('deleteDataExample').addEventListener('click', function() {
        localStorage.removeItem('token')
        document.getElementById('response').textContent = 'deleted'
    });

}

