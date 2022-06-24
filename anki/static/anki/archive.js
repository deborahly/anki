// Unarchive when button is clicked:
document.querySelectorAll('.unarchive-btn').forEach(element => {
    element.addEventListener('click', () => {                
        const csrftoken = getCookie('csrftoken');
        
        const deck_id = element.dataset.id;
        
        const unarchiveDeck = async (deck_id) => {
            try {
                const response = await fetch('http://127.0.0.1:8000/unarchive', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrftoken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({deck_id: deck_id})
                })
                if (response.ok) {
                    const list_element = document.getElementById(`li-${deck_id}`);
                    list_element.remove();
                }
            } catch (error) {
                console.error(error);
            } 
        }
        unarchiveDeck(deck_id);
    })
});

// Delete when button is clicked:
document.querySelectorAll('.delete-deck-btn').forEach(element => {
    element.addEventListener('click', () => {                
        var result = confirm('Are you sure to delete?');
        if (result) {
            const csrftoken = getCookie('csrftoken');
        
            const deck_id = element.dataset.id;
            
            const deleteDeck = async (deck_id) => {
                try {
                    const response = await fetch('http://127.0.0.1:8000/delete/deck', {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': csrftoken,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({deck_id: deck_id})
                    })
                    if (response.ok) {
                        const list_element = document.getElementById(`li-${deck_id}`);
                        list_element.remove();
                    }
                } catch (error) {
                    console.error(error);
                } 
            }
            deleteDeck(deck_id);
        } 
    })
}); 