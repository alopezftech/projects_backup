CREATE TABLE ScheduledTasks (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL UNIQUE,
    ScriptName NVARCHAR(255) NOT NULL,
    ScheduledTime TIME NOT NULL,
    Active BIT NOT NULL DEFAULT 1,
    Entorno NVARCHAR(10) NOT NULL DEFAULT 'Test' -- 'Test' o 'Prod'
);

CREATE TABLE TaskExecutions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TaskId INT NOT NULL FOREIGN KEY REFERENCES ScheduledTasks(Id),
    ExecutionTime DATETIME NOT NULL DEFAULT GETDATE(),
    Status NVARCHAR(50) NOT NULL, -- 'pending', 'success', 'error'
    Log NVARCHAR(MAX) NULL,
    Entorno NVARCHAR(10) NOT NULL -- 'Test' o 'Prod'
);
