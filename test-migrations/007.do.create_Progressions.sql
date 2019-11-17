CREATE TABLE Progressions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    userid INTEGER REFERENCES Users(id)
);