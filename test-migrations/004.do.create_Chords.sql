CREATE TABLE Chords (
    name TEXT NOT NULL,
    scale TEXT REFERENCES Scales(name),
    notes TEXT REFERENCES Notes(name)
);