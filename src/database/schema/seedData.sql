-- Seed data for the database for testing

-- Teachers data
INSERT INTO teachers (email, name) VALUES
('rick.sanchez@interdimensional.edu', 'Rick Sanchez'),
('morty.smith@school.edu', 'Morty Smith'),
('summer.smith@school.edu', 'Summer Smith'),
('jerry.smith@unemployed.com', 'Jerry Smith'),
('beth.smith@hospital.edu', 'Beth Smith'),
('birdperson@birdworld.edu', 'Birdperson'),
('squanch.squanch@squanchnet.edu', 'Squanch'),
('unity.collective@mindcontrol.edu', 'Unity'),
('evil.morty@citadel.edu', 'Evil Morty'),
('meeseeks@lookatus.edu', 'Mr. Meeseeks');

-- Students data
INSERT INTO students (email, name) VALUES
('sterling.archer@isis.spy', 'Sterling Archer'),
('lana.kane@isis.spy', 'Lana Kane'),
('malory.archer@isis.spy', 'Malory Archer'),
('cyril.figgis@isis.spy', 'Cyril Figgis'),
('pam.poovey@isis.spy', 'Pam Poovey'),
('cheryl.tunt@isis.spy', 'Cheryl Tunt'),
('ray.gillette@isis.spy', 'Ray Gillette'),
('krieger.algernop@isis.spy', 'Dr. Krieger'),
('woodhouse.arthur@isis.spy', 'Woodhouse'),
('barry.dylan@isis.spy', 'Barry Dylan');

-- Teacher-Student data
INSERT INTO teacherstudentregistration (teacherId, studentId)
SELECT t.id, s.id
FROM teachers t, students s
WHERE t.email = 'rick.sanchez@interdimensional.edu' 
AND s.email IN (
    'lana.kane@isis.spy',           
    'krieger.algernop@isis.spy',  
    'ray.gillette@isis.spy',      
    'sterling.archer@isis.spy'    
);

INSERT INTO teacherstudentregistration (teacherId, studentId)
SELECT t.id, s.id
FROM teachers t, students s
WHERE t.email = 'beth.smith@hospital.edu'
AND s.email IN (
    'krieger.algernop@isis.spy',
    'lana.kane@isis.spy',       
    'cyril.figgis@isis.spy'     
);

INSERT INTO teacherstudentregistration (teacherId, studentId)
SELECT t.id, s.id
FROM teachers t, students s
WHERE t.email = 'summer.smith@school.edu'
AND s.email IN (
    'sterling.archer@isis.spy',
    'cheryl.tunt@isis.spy',    
    'pam.poovey@isis.spy'      
);

INSERT INTO teacherstudentregistration (teacherId, studentId)
SELECT t.id, s.id
FROM teachers t, students s
WHERE t.email = 'morty.smith@school.edu'
AND s.email IN (
    'cyril.figgis@isis.spy',   
    'woodhouse.arthur@isis.spy',
    'barry.dylan@isis.spy'     
);

INSERT INTO teacherstudentregistration (teacherId, studentId)
SELECT t.id, s.id
FROM teachers t, students s
WHERE t.email = 'evil.morty@citadel.edu'
AND s.email IN (
    'malory.archer@isis.spy',       
    'sterling.archer@isis.spy',     
    'barry.dylan@isis.spy'          
);

INSERT INTO teacherstudentregistration (teacherId, studentId)
SELECT t.id, s.id
FROM teachers t, students s
WHERE t.email = 'jerry.smith@unemployed.com'
AND s.email IN (
    'cheryl.tunt@isis.spy'          
);

INSERT INTO teacherstudentregistration (teacherId, studentId)
SELECT t.id, s.id
FROM teachers t, students s
WHERE t.email = 'unity.collective@mindcontrol.edu'
AND s.email IN (
    'pam.poovey@isis.spy',
    'ray.gillette@isis.spy'
);
