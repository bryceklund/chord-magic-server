CREATE TABLE Frequencies (
    frequency DECIMAL PRIMARY KEY NOT NULL,
    octave TEXT NOT NULL,
    note TEXT REFERENCES Notes(name)
)