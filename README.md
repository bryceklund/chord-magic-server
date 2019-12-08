# Chord Magic API

This is the server and database repository that goes with [Chord Magic](https://github.com/bryceklund/chord-magic-client/).

The live app can be found [here](https://chord-magic.bryceklund.dev/).

## Summary

This server repo contains the API endpoints for chord, scale, and progression retrieval and storage, as well as user authentication, password hashing, and registration. It also houses the database where all those delicious treats live.

## Endpoints

GET /scales - Returns a list of possible scales (eg. maj, min)

GET /chords - Returns a list of notes (eg. A, Bb, B, C, Db, D)

GET /frequencies/:oct - Returns a list of note-frequency pairs in the given octave. (eg. GET /frequencies/zero => `{ A: 440, Bb: 493.8 }`)

GET /chord/:scale/:chord - Returns a list of notes in a given chords (eg. GET /chord/maj/a => `{ A, Db, E }`)

GET /progressions/saved - Grabs the JWT from the requester and returns a list of progressions saved by that user

GET /progressionChords/:progressionId - Returns a list of chord objects in a given progression. Each object includes the chord's order id, as well as its notes, instrument, octave, and name

POST /progressions/saved - Takes `name` and `chords` in the request body and saves a new progression with those values under the requesting user's id

PATCH /progressionChords/:progressionId - Overwrites a progression with the matching id in the request parameters

DELETE /progressionChords/:progressionId - Deletes a progression with the matching id in the request parameters

POST /login - Checks the database for a user, validates the given password, and returns a JWT if all goes well. 

POST /users - Checks the database for a username, and if it's not taken, stores a new username, hashed password, and generated userid, returning a success message


## Technologies Used

Written in Node.js using Express for the API, JWT for authentication, bcrypt for encryption, and PostgreSQL for the database. 
