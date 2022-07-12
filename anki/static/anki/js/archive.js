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
                        document.getElementById(`li-${deck_id}`).remove();
                        document.getElementById('message').innerHTML = 'Deck deleted.'
                    }
                } catch (error) {
                    console.error(error);
                } 
            }
            deleteDeck(deck_id);
        } 
    })
}); 