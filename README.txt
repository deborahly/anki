HIGH CONCEPT FOR MOOVIEE
    V-CARD is a learning app that offers a practical way to create, organize and study a second language with cards.

DISTINCTIVENESS AND COMPLEXITY
    V-CARD contains many features, such as create, edit and delete cards, and study with time and/or other configurable restrictions.

KEY FEATURES
    When not logged in, users will be able to: 
        - view card examples
        - view step by step to start studying with cards
    When logged in, users will be able to:
        - view cards
        - create cards
        - organize cards
        - label cards
        - study with cards
        - configurate account

API
    (1) GET /login
        Sending a GET request to /login will return 'network/login.html' where user can fill and submit the login form

    (2) POST /login
        Sending a POST request to /login will attempt to sign user in
        If authentication not successful, server will return 'network/login.html' passing message 'Invalid username and/or password.'
        If authentication successful, server will log user in and redirect user to index
        Request body:
        {
            'username': <str>,
            'password': <str>
        }

    (3) GET /logout
        Sending a GET request to /logout will log user out and redirect user to index

    (4) GET /register
        Sending a GET request to /register will return 'network/register.html' where user can fill and submit the register form

    (5) POST /register
        Sending a POST request to /register will attempt to register user
        If password and password confirmation do not match, server will return 'network/register.html' passing message 'Passwords must match.'
        If unable to save new user for username already taken, server will return 'network/register.html' passing message 'Username already taken.'
        If able to save new user, server will log user in and redirect user to index
        Request body:
        {
            'username': <str>,
            'email': <str>,
            'password': <str>,
            'confirmation': <str>
        }

    (6) GET /index
        Sending a GET request to /index will return "index.html" with:
        If user is authenticated:
        {
            'news': [<link>],
            'lists': [{}]
        }
        If user is not authenticated:
        {
            'last_updated_list': {},
            'last_tracking_list': {},
            'latest_updates': [{}],
            'latest_reactions': [{}]
        }

    (7) GET /search
        Sending a GET request to /search with user inputs as parameters will return:
        If more than one result, links to all results
        If zero result, message 'No results for the submitted query.'
        If only one result, the movie or list information

    (8) POST /save
        Sending a POST request to /save requesting to create or edit a list will return HttpResponse(status=201)
        Request body:
        {
            "list_id": <int>,
            "content": <str>
        }

    (9) PUT /<int:list_id>
        Sending a PUT request to /<int:list_id> requesting to update watched/unwatched or track/untrack will return a JsonResponse as below:
        {
            status=204,
            'watched': 'True'/'False',
            'tracking': 'True'/'False'
        }
        Request body:
        {
            'action': 'watch'/'unwatch'/'track'/'untrack'
        }

    (10) POST /comment
        Sending a POST request to /comment requesting to save or delete a comment will return a JsonResponse as below:
        {
            status=201,
            'message': 'Comment saved.'/'Comment deleted.'
        }
        Request body:
        {
            'content': <str>,
            'comment_id': <int>
        }

    (11) PUT /comment
        Sending a PUT request to /comment requesting to report a comment will return a JsonResponse as below:
        {
            status=201,
            'message': 'Comment will be subject to the staff analysis in the next few days.'
        }
        Request body:
        {
            'comment_id': <int>
        }

    (12) PUT /<str:username>
        Sending a PUT request to /<str:username> requesting to update follow/unfollow will return HttpResponse(status=204)
        Request body:
        {
            "action": "follow"/"unfollow"
        }

MOCK-UP
    (1) Header
        If user is not authenticated:
        - link to index page
        - link to search page
        - login
        - register

        If user is authenticated:
        - link to index page
        - link to search page
        - link to create new list page
        - link to user page
        - link to configuration page
        - logout

    (2) Index page
        If user is not authenticated:
        - latest news on movies from selected medias (later)
        - public lists selected randomly
        If user is authenticated, additionally:
        - most recent list user updated (own list)
        - most recent list user started tracking (someone else's list)
        - summary of recent updates from following users
        - summary of recent reaction to user's lists or comments

    (3) Search page
        - movie search form
        - list search form

    (4) Create new list page
        - create new list form

    (5) User page (only authenticated)
        - user's own movie lists (aka movie notebooks)
        - other users' lists that user is tracking
        - other users that user is following

    (6) Configuration page (only authenticated)
        - change password
        - change website theme (color palette)

DEVELOPMENT GUIDE
    (1) Add Index page ('index.html')
        Add link in the navigation bar ('layout.html') for accessing the page
        Display all page elements
    (2) Add Login page ('login.html')
    (3) Add Register page ('register.html')
    (4) Add Search page ('search.html')
    (5) Add New List page ('new_list.html')
    (6) Add User page ('user.html')
    (7) Add Configuration page ('configuration.html')
    (8) Add Movie page ('movie.html')
    (9) Prepare and import external data to default database   
    (10) Create models.Activity
    (11) Create models.List
    (12) Create models.Comment