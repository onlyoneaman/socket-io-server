-- Insert initial data into the Files table
INSERT INTO Files (id, name, status) VALUES
    ('1', 'Untitled File 1', 0),
    ('2', 'Untitled File 2', 0);

-- Insert initial data into the Fields table
INSERT INTO Fields (id, name, status, file_id) VALUES
    ('1', 'Step 1', 0, '1'),
    ('2', 'Step 2', 0, '1'),
    ('3', 'Step 1', 0, '2'),
    ('4', 'Step 2', 0, '2');
