CREATE TABLE ProgressionChords (
    chord TEXT REFERENCES Notes(name),
    scale TEXT REFERENCES Scales(name),
    progressionid TEXT REFERENCES Progressions(id) ON DELETE CASCADE,
    orderid INTEGER,
    voice TEXT NOT NULL,
    oct TEXT NOT NULL,
    active BOOLEAN DEFAULT false
);